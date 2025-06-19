const QueueEntry = require("../models/queueModel");
const User = require("../models/userModel");
const { sendTurnNotificationEmail } = require("../utils/email.js");
const Clinic = require("../models/clinicModel");

// Emit queue update to all connected clients for a specific clinic
async function emitQueueUpdate(clinicId, io) {
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  let clinicName = "";
  try {
    const clinic = await Clinic.findById(clinicId);
    if (clinic) {
      clinicName = clinic.clinicName;
    }
  } catch (err) {
    console.error("Error fetching clinic info for queue update:", err);
  }

  // Fetch queue entries
  let queueEntries = await QueueEntry.find({
    clinicId,
    joinedAt: { $gte: todayStart, $lte: todayEnd },
  }).sort({ isEmergency: -1, tokenNumber: 1 });

  // Send notification before emitting update
  try {
    const nextPatient = queueEntries.find(
      (q) => q.status === "waiting" && !q.notified
    );
    if (nextPatient && nextPatient.patient && nextPatient.patient.email) {
      await sendTurnNotificationEmail(
        nextPatient.patient.email,
        nextPatient.patient.name,
        nextPatient.tokenNumber,
        clinicName
      );
      nextPatient.notified = true;
      await nextPatient.save();
      console.log(`Notification email sent to ${nextPatient.patient.email}`);
    }
  } catch (error) {
    console.error("Error sending notification email:", error);
  }

  // Re-fetch queue entries to get updated notified flag
  queueEntries = await QueueEntry.find({
    clinicId,
    joinedAt: { $gte: todayStart, $lte: todayEnd },
  }).sort({ isEmergency: -1, tokenNumber: 1 });

  // Calculate statistics as before
  const completedPatients = queueEntries.filter(
    (q) =>
      q.status === "done" &&
      q.joinedAt &&
      q.serviceStartTime &&
      q.serviceEndTime
  );

  const avgWaitTime = completedPatients.length
    ? Math.round(
        completedPatients
          .map((q) => (q.serviceStartTime - q.joinedAt) / 60000)
          .reduce((a, b) => a + b, 0) / completedPatients.length
      )
    : 15;

  const avgServiceTime = completedPatients.length
    ? Math.round(
        completedPatients
          .map((q) => (q.serviceEndTime - q.serviceStartTime) / 60000)
          .reduce((a, b) => a + b, 0) / completedPatients.length
      )
    : 10;

  let waitingCount = 0;
  const queueWithEstimates = queueEntries.map((entry) => {
    let estimatedWaitTime = null;
    if (entry.status === "waiting") {
      estimatedWaitTime = avgServiceTime * waitingCount;
      waitingCount += 1;
    }
    return {
      ...entry.toObject(),
      estimatedWaitTime,
    };
  });

  if (io) {
    io.to(clinicId.toString()).emit("queue-updated", {
      queue: queueWithEstimates,
      statistics: {
        averageWaitTime: avgWaitTime,
        averageServiceTime: avgServiceTime,
        totalWaiting: queueEntries.filter((q) => q.status === "waiting").length,
        currentlyServing: queueEntries.filter((q) => q.status === "serving")
          .length,
        totalCompleted: completedPatients.length,
      },
    });
  }
}

// Helper: Get doctor's average consultation time for a clinic
async function getDoctorAverageTime(clinicId) {
  try {
    const doctor = await User.findOne({
      "clinicMemberships.clinicId": clinicId,
      "clinicMemberships.role": "Doctor",
    }).maxTimeMS(5000);

    if (!doctor) return 10;

    const membership = doctor.clinicMemberships.find(
      (m) => m.clinicId.equals(clinicId) && m.role === "Doctor"
    );
    return membership?.averageConsultationTime || 10;
  } catch (error) {
    console.error("Error fetching doctor average time:", error);
    return 10;
  }
}

// Join the queue
exports.joinQueue = async (req, res) => {
  const { clinicId, patient, visitType, reason, isEmergency, notifyBySMS } =
    req.body;

  console.log("Received request to join queue:", {
    clinicId,
    patient,
    visitType,
    reason,
    isEmergency,
    notifyBySMS,
  });

  try {
    const now = new Date();
    const istNow = new Date(
      now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );

    const openTime = new Date(istNow);
    openTime.setHours(8, 0, 0, 0);

    const closeTime = new Date(istNow);
    closeTime.setHours(22, 0, 0, 0);

    if (istNow < openTime || istNow > closeTime) {
      return res.status(400).json({
        message:
          "Clinic is closed. Please register between 8:00 AM and 10:00 PM.",
      });
    }

    // Today's range
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    // Get next token number
    const latestEntry = await QueueEntry.findOne({
      clinicId,
      joinedAt: { $gte: todayStart, $lte: todayEnd },
    }).sort({ tokenNumber: -1 });

    const nextToken = latestEntry ? latestEntry.tokenNumber + 1 : 1;

    // Count patients ahead in queue (waiting or serving)
    const patientsAhead = await QueueEntry.countDocuments({
      clinicId,
      joinedAt: { $gte: todayStart, $lte: todayEnd },
      status: { $in: ["waiting", "serving"] },
    });

    // Get doctor's average consultation time
    let avgConsultationTime;
    try {
      avgConsultationTime = await getDoctorAverageTime(clinicId);
    } catch (error) {
      console.error("Failed to get doctor average time, using default:", error);
      avgConsultationTime = 10;
    }

    // Calculate estimated start time based on patients ahead and average consultation time
    const estimatedStartTime = new Date(
      now.getTime() + avgConsultationTime * patientsAhead * 60000
    );

    // Create new queue entry
    const newEntry = new QueueEntry({
      clinicId,
      patient,
      visitType,
      reason,
      isEmergency,
      notifyBySMS,
      tokenNumber: nextToken,
      estimatedStartTime,
    });

    await newEntry.save();

    // Get io instance and emit update
    const io = req.app.get("io");
    await emitQueueUpdate(clinicId, io);

    // After saving the new entry and emitting the update:
    const queueEntries = await QueueEntry.find({
      clinicId,
      joinedAt: { $gte: todayStart, $lte: todayEnd },
    }).sort({ isEmergency: -1, tokenNumber: 1 });

    const completedPatients = queueEntries.filter(
      (q) =>
        q.status === "done" &&
        q.joinedAt &&
        q.serviceStartTime &&
        q.serviceEndTime
    );

    const avgWaitTime = completedPatients.length
      ? Math.round(
          completedPatients
            .map((q) => (q.serviceStartTime - q.joinedAt) / 60000)
            .reduce((a, b) => a + b, 0) / completedPatients.length
        )
      : 15;

    const avgServiceTime = completedPatients.length
      ? Math.round(
          completedPatients
            .map((q) => (q.serviceEndTime - q.serviceStartTime) / 60000)
            .reduce((a, b) => a + b, 0) / completedPatients.length
        )
      : 10;

    let waitingCount = 0;
    const queueWithEstimates = queueEntries.map((entry) => {
      let estimatedWaitTime = null;
      if (entry.status === "waiting") {
        estimatedWaitTime = avgServiceTime * waitingCount;
        waitingCount += 1;
      }
      return {
        ...entry.toObject(),
        estimatedWaitTime,
      };
    });

    const statistics = {
      averageWaitTime: avgWaitTime,
      averageServiceTime: avgServiceTime,
      totalWaiting: queueEntries.filter((q) => q.status === "waiting").length,
      totalCompleted: completedPatients.length,
      currentlyServing: queueEntries.filter((q) => q.status === "serving")
        .length,
    };

    return res.status(201).json({
      success: true,
      queueNumber: nextToken,
      estimatedStartTime,
      estimatedWaitTime: avgConsultationTime * patientsAhead,
      message: "Successfully joined the queue",
      entry: newEntry,
      queue: queueWithEstimates,
      statistics,
    });
  } catch (err) {
    console.error("Error joining queue:", err);
    return res.status(500).json({
      message: "Server error while joining queue.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Get today's queue for a clinic
exports.getTodayQueue = async (req, res) => {
  try {
    const { clinicId } = req.params;

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const queueEntries = await QueueEntry.find({
      clinicId,
      joinedAt: { $gte: startOfDay, $lte: endOfDay },
    }).sort({ isEmergency: -1, tokenNumber: 1 });

    // Calculate metrics from completed patients
    const completedPatients = queueEntries.filter(
      (q) =>
        q.status === "done" &&
        q.joinedAt &&
        q.serviceStartTime &&
        q.serviceEndTime
    );

    // Average wait time (join to service start)
    const avgWaitTime = completedPatients.length
      ? Math.round(
          completedPatients
            .map((q) => (q.serviceStartTime - q.joinedAt) / 60000)
            .reduce((a, b) => a + b, 0) / completedPatients.length
        )
      : 15;

    // Average service time (service start to end)
    const avgServiceTime = completedPatients.length
      ? Math.round(
          completedPatients
            .map((q) => (q.serviceEndTime - q.serviceStartTime) / 60000)
            .reduce((a, b) => a + b, 0) / completedPatients.length
        )
      : 10;

    // Calculate estimated wait time for each waiting patient
    let waitingCount = 0;
    const queueWithEstimates = queueEntries.map((entry) => {
      let estimatedWaitTime = null;
      let actualWaitTime = null;
      let actualServiceTime = null;

      if (entry.status === "waiting") {
        estimatedWaitTime = avgServiceTime * waitingCount;
        waitingCount += 1;
      } else if (entry.status === "serving") {
        estimatedWaitTime = 0;
        if (entry.joinedAt && entry.serviceStartTime) {
          actualWaitTime = Math.round(
            (entry.serviceStartTime - entry.joinedAt) / 60000
          );
        }
      } else if (entry.status === "done") {
        if (entry.joinedAt && entry.serviceStartTime) {
          actualWaitTime = Math.round(
            (entry.serviceStartTime - entry.joinedAt) / 60000
          );
        }
        if (entry.serviceStartTime && entry.serviceEndTime) {
          actualServiceTime = Math.round(
            (entry.serviceEndTime - entry.serviceStartTime) / 60000
          );
        }
      }

      return {
        ...entry.toObject(),
        estimatedWaitTime: estimatedWaitTime,
        actualWaitTime: actualWaitTime,
        actualServiceTime: actualServiceTime,
      };
    });

    res.status(200).json({
      success: true,
      queue: queueWithEstimates,
      statistics: {
        averageWaitTime: avgWaitTime,
        averageServiceTime: avgServiceTime,
        totalWaiting: waitingCount,
        totalCompleted: completedPatients.length,
        currentlyServing: queueEntries.filter((q) => q.status === "serving")
          .length,
      },
    });
  } catch (err) {
    console.error("Failed to fetch queue:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
};

// Update patient status
exports.updateStatus = async (req, res) => {
  const { entryId } = req.params;
  const { status, servedBy } = req.body;

  try {
    const update = { status };
    let updateDoctorStats = false;
    let serviceDuration = null;

    if (status === "serving") {
      update.serviceStartTime = new Date();
      if (servedBy) update.servedBy = servedBy;
    }

    if (status === "done") {
      update.serviceEndTime = new Date();
      updateDoctorStats = true;
    }

    const updated = await QueueEntry.findByIdAndUpdate(entryId, update, {
      new: true,
    });

    // Update doctor's average consultation time if patient is marked as done
    if (
      updateDoctorStats &&
      updated.servedBy &&
      updated.serviceStartTime &&
      updated.serviceEndTime
    ) {
      serviceDuration =
        (updated.serviceEndTime - updated.serviceStartTime) / 60000;

      // Find doctor user and update stats
      try {
        const doctor = await User.findById(updated.servedBy).maxTimeMS(5000);
        if (doctor) {
          const membership = doctor.clinicMemberships.find(
            (m) => m.clinicId.equals(updated.clinicId) && m.role === "Doctor"
          );
          if (membership) {
            const prevAvg = membership.averageConsultationTime || 0;
            const prevCount = membership.totalPatientsServed || 0;
            const newAvg =
              (prevAvg * prevCount + serviceDuration) / (prevCount + 1);

            membership.averageConsultationTime = newAvg;
            membership.totalPatientsServed = prevCount + 1;
            await doctor.save();
          }
        }
      } catch (error) {
        console.error("Error updating doctor stats:", error);
      }
    }

    // Emit queue update
    const io = req.app.get("io");
    await emitQueueUpdate(updated.clinicId, io);

    res.status(200).json({
      success: true,
      entry: updated,
      serviceDuration: serviceDuration,
    });
  } catch (err) {
    console.error("Error updating status:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update status" });
  }
};

// Get clinic details by ID
exports.getClinicById = async (req, res) => {
  const { clinicId } = req.params;

  try {
    const clinic = await Clinic.findById(clinicId);

    if (!clinic) {
      return res.status(404).json({ message: "Clinic not found" });
    }

    res.status(200).json(clinic);
  } catch (error) {
    console.error("Error fetching clinic:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
