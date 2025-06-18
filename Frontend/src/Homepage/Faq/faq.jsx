import React, { useState } from 'react';
import './faq.css';

export const FAQ = () => {
  const faqs = [
    {
      question: "How does the queue management system work?",
      answer:
        "Patients can check-in digitally, receive a token number, and track their position in real-time. The system provides estimated wait times and sends notifications via email when it's your turn."
    },
    {
      question: "Is the inventory management system secure?",
      answer:
        "Yes, our platform ensures  all medical inventory data is protected and secure."
    },
    {
      question: "Can multiple hospitals share inventory?",
      answer:
        "Currently we are in our MVP phase, but we plan to introduce a sharing network where hospitals can share excess inventory with nearby facilities to reduce waste."
    },
    {
      question: "What happens to expired medications?",
      answer:
        "Coming soon, our system will allow hospitals to donate expired medications to NGOs for redistribution, ensuring they are used effectively."
    },
    {
      question: "Is there a mobile app available?",
      answer:
        "Launching soon our mobile app will allow patients to check-in, track their queue status, and receive notifications directly on app."
    }
  ];

  // Track which item is open — only one open at a time for "single" collapsible behavior
  const [openIndex, setOpenIndex] = useState(null);

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="faq-section">
      <div className="faq-container">
        <div className="faq-header">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <p className="faq-subtitle">
            Get answers to common questions about our healthcare solutions
          </p>
        </div>

        <div className="accordion" role="region" aria-label="Frequently Asked Questions">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`accordion-item ${openIndex === index ? 'open' : ''}`}
            >
              <button
                aria-expanded={openIndex === index}
                aria-controls={`faq-panel-${index}`}
                id={`faq-header-${index}`}
                className="accordion-trigger"
                onClick={() => toggleIndex(index)}
              >
                {faq.question}
                <span className={`accordion-icon ${openIndex === index ? 'open' : ''}`}>
                  {/* Simple arrow icon */}
                  ▶
                </span>
              </button>
              <div
                id={`faq-panel-${index}`}
                role="region"
                aria-labelledby={`faq-header-${index}`}
                className="accordion-panel"
                hidden={openIndex !== index}
              >
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
