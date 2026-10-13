// All form questions, in order. Edit this list to change the form.
// Types: name, date, text, textarea, yesno, multi, single, statement, signature
const YES_NO = ["Yes", "No"];

window.QUESTIONS = [
  { id: "student_name", type: "name", label: "Student Full Name", required: true },
  { id: "date_of_birth", type: "date", label: "Date of Birth", required: true },
  { id: "date_of_leaving", type: "date", label: "Date of Enrolment / Leaving", required: true },
  { id: "year_grade", type: "text", label: "Year / Grade", required: true },
  { id: "transferring_to", type: "text", label: "Transferring To (School Name)", required: true },
  { id: "current_level", type: "text", label: "Current Level / Pathway", required: true },
  { id: "attendance", type: "single", label: "Overall attendance over the last academic year?", required: true,
    options: ["95-100%", "90-94%", "85-89%", "Below 85%", "Significant concerns"] },
  { id: "attendance_concerns", type: "yesno", label: "Concerns re: attendance / punctuality?", required: true },
  { id: "attendance_details", type: "textarea", label: "Attendance details" },
  { id: "health_conditions", type: "textarea", label: "Any known physical, sensory or medical / health conditions" },

  { id: "behaviour_concerns", type: "yesno", label: "Significant behaviour concerns?", required: true },
  { id: "behaviour_details", type: "textarea", label: "Behaviour details" },
  { id: "behaviour_areas", type: "multi", label: "Relevant behavioural concerns",
    options: ["Disruption", "Defiance", "Aggression", "Bullying", "Peer difficulties", "Online behaviour",
              "Repeated sanctions", "Suspension", "Exclusion", "Other"] },
  { id: "incidents", type: "textarea", label: "Significant incidents, patterns, triggers" },
  { id: "interventions", type: "textarea", label: "Current behaviour interventions" },

  { id: "learning_support", type: "yesno", label: "Currently receives additional learning support?", required: true },
  { id: "support_areas", type: "multi", label: "Relevant support",
    options: ["SEN/SEND", "Individual Learning Plan", "EAL", "Literacy", "Numeracy",
              "Educational Psychologist", "Speech & Language", "Other"] },
  { id: "needs_support", type: "textarea", label: "Identified needs & support currently provided" },
  { id: "classroom_adjustments", type: "textarea", label: "Effective classroom adjustments / successful strategies" },

  { id: "pastoral_concerns", type: "yesno", label: "Significant pastoral or wellbeing concerns?", required: true },
  { id: "pastoral_details", type: "textarea", label: "Pastoral details" },
  { id: "pastoral_areas", type: "multi", label: "Relevant pastoral areas",
    options: ["Emotional wellbeing", "Anxiety / mood", "Social difficulties", "Peer relationships",
              "Family circumstances", "Counsellor support", "Significant life events", "Other"] },
  { id: "pastoral_strategies", type: "textarea", label: "Pastoral strategies / interventions that have been helpful" },

  { id: "safeguarding", type: "yesno", label: "Are there any safeguarding / child protection concerns?", required: true,
    help: "If yes, please contact the DSL directly. Please do not share safeguarding details in this form." },

  { id: "parent_engagement", type: "single", label: "Overall parent/carer engagement", required: true,
    options: ["Excellent", "Good", "Generally positive", "Inconsistent", "Limited", "Significant concerns"] },
  { id: "parent_difficulties", type: "yesno", label: "Difficulties engaging with parents/carers?", required: true },
  { id: "parent_details", type: "textarea", label: "Parent engagement details" },
  { id: "family_circumstances", type: "textarea", label: "Family circumstances / home situation considerations" },

  { id: "external_services", type: "yesno", label: "Currently supported by external services / professionals / agencies?", required: true },
  { id: "services", type: "multi", label: "Relevant services",
    options: ["Educational Psychologist", "CAMHS / Mental health services", "Social Care", "Speech & Language",
              "Occupational Therapy", "Medical services", "Counsellor", "Other"] },
  { id: "service_details", type: "textarea", label: "Details / contacts (where sharing permission given)" },

  { id: "strengths", type: "textarea", label: "Key strengths / interests / positive qualities" },
  { id: "motivation", type: "textarea", label: "What motivates the student" },
  { id: "approaches", type: "textarea", label: "Approaches that work particularly well" },
  { id: "struggles", type: "textarea", label: "Situations / environments where the student may struggle" },
  { id: "transition_advice", type: "textarea", label: "Advice for a successful transition" },
  { id: "integration_support", type: "yesno", label: "Would you recommend any specific support / additional strategies to ensure successful integration?", required: true },
  { id: "integration_details", type: "textarea", label: "Integration details" },

  { id: "records", type: "multi", label: "Records Being Transferred", required: true,
    options: ["Full student file", "Attendance", "Behaviour", "Academic reports", "SEN/SEND", "ILP",
              "Medical / health notes", "Safeguarding", "Pastoral / counselling", "External agency reports"] },

  { type: "statement", text: "To the best of my knowledge, the information provided is accurate and reflects the student's current circumstances and school history. I understand that safeguarding and child protection information should be shared securely and handled confidentially by the receiving school." },

  { id: "completed_by", type: "name", label: "Full Name", required: true },
  { id: "position", type: "text", label: "Position", required: true },
  { id: "signature", type: "signature", label: "Signature" },
  { id: "date", type: "date", label: "Date" },
];
