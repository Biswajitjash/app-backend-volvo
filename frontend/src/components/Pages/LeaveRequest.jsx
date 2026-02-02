import React, { useState, useRef, useEffect } from 'react';
import run from '../../gemini'; // or your LLM API
import { speakFunction } from '../../utils/SpeakFunction';
import { CiMicrophoneOn } from 'react-icons/ci';
import html2pdf from 'html2pdf.js';
import MultiReasonSelector from './MultiReasonSelector';




const LeaveRequest = () => {



  const [leaveDate, setLeaveDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD for input[type=date]
  });

  const [leaveDate2, setLeaveDate2] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD for input[type=date]
  });

  const [mail_to, setMailto] = useState('');
  const [mail_id, setMail_id] = useState('');
  const [reason, setReason] = useState('');
  const [size, setSize] = useState('5');
  const [lowerQuery, setLowerQuery] = useState('');
  const [responseText, setResponseText] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [selectedReasons, setSelectedReasons] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const editableRef = useRef(null);






  const res_leave_request = [
  {
    no: 1,
    response_text: `Subject: Leave Request for 15th July 2025

Dear Mr. Aloke Chandra,

I hope this message finds you well.

I am writing to request a leave of absence for one day on 15th July 2025 due to personal reasons.
Kindly grant me leave for the mentioned date.

Please let me know if any further details are required. I will ensure that all my responsibilities are managed and no work is disrupted during my absence.

Thank you for your understanding and support.

Best regards,
Biswajit Jash
Employee ID: 41004587`
  },
  {
    no: 2,
    response_text: `Subject: Request for One-Day Leave on 15th July 2025

Dear Mr. Aloke Chandra,

I hope you are doing well.

I would like to request a one-day leave on 15th July 2025 due to personal reasons. I will ensure that all my tasks are either completed in advance or appropriately delegated.

I kindly request your approval for the same.

Thank you for your consideration.

Sincerely,
Biswajit Jash
Employee ID: 41004587`
  }
];

  const mailto = [
    { name: "Mr. Alok chandra", mailid: "alok.chandra@ampl.in" },
    { name: "Mr. Subrata chatterjee", mailid: "mis.manager@equipcare.in" },
    { name: "Mr. Kaushal Kumar", mailid: "scm.sm@equipcare.in" },
    { name: "Mr. Tanmoy Chatterjee", mailid: "cws.manager@equipcare.in" },
    { name: "Mrs. SA ", mailid: "shruti.agarwal.@ampl.in" },
  ];


  const reasonForLeave3 = [
    "Sick Leave",
    "Casual Leave",
    "Personal Work",
    "Maternity Leave",
    "Family Emergency",
    "Vacation",
    "Medical Appointment",
    "Child Care",
    "Bereavement Leave",
    "Marriage Leave",
    "For 1st half",
    "For 2nd half",
    "For 1 days",
    "For 2 days",
    "For 3 days",
    "For 4 days",
    "For 5 days",
    "For 1 week",
    "For 2 week",
    "For 3 week",
    "For 1 month",
    "For 2 month",
    "For 3 month",
    "For 6 month",
    "For 12 month",
  ];

  const reasonForLeaveLong3 = [
    "Write a leave request  for a one-day medical leave due to high fever, in a professional tone.",
    "Draft a leave application to my reporting manager for an urgent family emergency that requires my presence at home.",
    "Create a short leave letter to inform my manager about personal work  and request approval.",
    "Write a formal leave request for attending a close relative’s wedding, mentioning the date and reason.",
    "Generate a half-day leave request for the 1st half due to a doctor appointment.",
    "Generate a half-day leave request for the 2nd half due to a doctor appointment.",
    "Write a polite leave request for a festival celebration with family.",
    "Draft a leave mail for attend my child’s annual school function ",
    "Draft a leave mail for attend my child’s annual school meeting ",
    "Create a short and respectful leave request to inform  about an unplanned sick leave today.",
    "Generate a formal leave application to request travel and rest .",
    "Compose a leave letter informing my supervisor about a loss in the family and requesting leave",
    // "Write a maternity leave application  due to my expected delivery date comming soon. Keep it formal and polite",
    "Generate a formal letter to HR requesting maternity leave starting from in accordance with the company’s leave policy.",
    "For 1 days",
    "For 2 days",
    "For 3 days",
    "For 4 days",
    "For 5 days",
    "For 1 week",
    "For 2 week",
    "For 3 week",
    "For 1 month",
    "For 2 month",
    "For 3 month",
    "For 6 month",
    "For 12 month",
  ];


  const loginname = localStorage.getItem('Uname');
  const loginid = localStorage.getItem('Userid');
  const emailid = localStorage.getItem('Usermail');



  const generateLeaveQuery = () => {


const l_prompt = `Write a professional ${reason.trim()} request 
addressed to ${mail_to.trim()} seeking approval for leave on ${leaveDate}. 

The email should:
- Mention the letter date as today's date at right corner of the letter .
- Mention the Subject seperately as Sub with ${loginid.trim()} under () .
- Letter limited to around ${size.trim()} lines.
- Mention the  Name as ${loginname.trim()} . 
- Mentioned either ID as ${loginid.trim()} or the email ID ${emailid.trim()} at the end.';
- Letter tone whould be polite and formal.
- Structure follows proper Letter. `;




const l_prompt3  =`Rabindranath Tagore was not just a poet; he was a cultural icon, a humanist, and a visionary who profoundly impacted India's intellectual and artistic landscape. Explore Tagore's multifaceted legacy, examining his contributions to literature, education, and social reform, while analyzing 
how his work reflects and shapes Indian identity and thought. Consider the unique perspective he brought to the world through his writings and his vision for a harmonious, globally connected yet rooted India.
Key areas to consider while writing:
Early Life and Influences:
Briefly touch upon his upbringing in a prominent Bengali family, the intellectual and artistic atmosphere of his home, and his early exposure to both Western and Indian thought. 
Literary Contributions:
Discuss his major works (Gitanjali, Gora, The Home and the World, etc.), analyzing their themes, styles, and their impact on Indian and global literature. Pay attention to his use of symbolism, nature imagery, and his exploration of human emotions. 
Educational Philosophy:
Explore his vision for Visva-Bharati University (Shantiniketan) and his belief in a holistic, child-centric approach to education that integrated learning with nature and culture. 
Social and Political Views:
Analyze his stance on nationalism, his critique of blind nationalism, and his advocacy for internationalism and humanism. Discuss his role in the Indian independence movement and his complex relationship with British rule. 
Impact on Indian Identity:
Examine how Tagore's work shaped and reflected Indian identity, his contributions to the development of Bengali language and culture, and his role in fostering a sense of national pride. 
Global Influence:
Discuss his international recognition, his Nobel Prize win, and the enduring appeal of his work across cultures and languages. 
Legacy and Relevance:
Analyze his continuing relevance in the 21st century, his influence on contemporary Indian writers and thinkers, and his vision for a more inclusive and harmonious world. 
Indian English Tone:
Maintain a tone that is both eloquent and accessible, drawing inspiration from the rich tradition of Indian English writing. Use vivid imagery, evocative language, and a thoughtful, reflective style that resonates with the Indian sensibility. 
Incorporate these points:
Anecdotes and Examples: Use specific examples from Tagore's life and works to illustrate your points.
Quotes: Include relevant quotes from Tagore's writings to support your arguments.
Personal Reflections: Share your own thoughts and interpretations of Tagore's legacy.
Critical Analysis: Offer a balanced perspective, acknowledging both the strengths and 
potential limitations of Tagore's work.`;


// const l_prompt  =`Know me today weather report in Koklata-Alipore 
        // -If you do not have access to real-time weather data for Kolkata-Alipore, then follow.
    // Instruction:
    // - Fetch data Go the https://city.imd.gov.in/citywx/city_weather_test_try.php?id=42807`;

    // I do not have access to external websites or the internet to fetch real-time data from the provided URL. Therefore, I can't provide you with a current weather report for Kolkata-Alipore.
   

    const realTimeWeather = "Weather today in Kolkata-Alipore: Temperature 34°C, Humidity 78%, Rain expected in the evening.";
const l_prompt4 = `Using the below weather data, give a short friendly report:\n\n${realTimeWeather} with  tabuler format for data `;

    // const l_prompt = `Write a professional ${reason} Request 
    // to ${mail_to} for approval on date ${leaveDate}  
    // within ${size} lines, and mentioned 
    // Employee ID as ${loginid}  or emailID ${emailid} at the end of letter 
    // mentioned Letter Date with timestamp in the top right corner `;

    setLowerQuery(l_prompt.toLowerCase());

    // alert(`i am out set lowerqry${lowerQuery}`);

    if (!lowerQuery?.trim()) {
      alert(`I am returning for null/empty lowerQuery: ${lowerQuery}`);
      setShowModal(false);
      return;
    }

    // return sentence.toLowerCase();
    return lowerQuery;
  };


  const handleMicToggle = () => {
    if (speaking) {
      window.speechSynthesis.cancel(); // stop speaking
      setSpeaking(false);
    } else {
      speakFunction(responseText);
      setSpeaking(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const query = generateLeaveQuery();


    if (!query?.trim()) {
      // alert(`I am returning for null/empty in handleSubmit: ${query}`);
      setShowModal(false);
      return;
    }

    try {

         alert(query);
      const result = await run(query);

      // alert(`6 i an return form run  rusult is ${result}`);
      console.log(result[0]);

      // console.log(result[0]);
      // console.log(result[1]);

// alert(`result[0]`);

      const clean = result[0]
        .replace(/\*\*/g, "")
        .replace(/\*/g, "")
        .replace(/\[/g, "")
        .replace(/\]/g, "")
        // .replace(/\"/g, "")
        // .replace(/e\.g\./gi, "Like") // escape dot properly
        .replace(/google/gi, loginname)
        .replace(/YourName|Your Name|yourname|your name/gi, loginname);
      // .replace(/^\s*\n/gm, "")     // remove lines with only whitespace
      //  .replace(/\n{2,}/g, "\n");
      // .replace(/^\s*\n/gm, "")
      // .trim();
      // .replace(/Your Employee Id|Your employee id|employee id|employee|Employee ID|Employee Id|Employee/gi, loginid)
      // .replace(/Email Address|Your Email Address|mailid|MailId|Mail Id/gi, emailid);


      console.log(clean);
      setResponseText(clean);
// alert(`Gemini API/LLM response:', ${clean}`);

      setShowModal(true);


    } catch (err) {
      // console.error('LLM Error:', err);
      // console.error(res_leave_request[0].response_text);
      // setResponseText("Sorry, something went wrong.");
      // setResponseText(res_leave_request[0].response_text);
      // const reply = res_leave_request[0].response_text;
      // console.log(reply);

      // setResponseText(reply);
      // console.log(responseText);

      alert(`Gemini API/LLM Error:', ${err}`);


      setShowModal(false);
    }
  };

  const handleSendMail = async () => {
    try {
      const response = await fetch("http://localhost:8800/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: recipient,
          subject: "Leave Application Request",
          text: responseText,
        }),
      });


      const result = await response.text();
      alert(result);
    } catch (err) {
      console.error("Email Error:", err);
      alert("Failed to send mail.");
    }
  };

  const handlePrintPDF = () => {
    if (!responseText || responseText.trim() === "") {
      alert("❗ No content found to print");
      return;
    }

    // Create a temporary container element
    const element = document.createElement("div");
    element.style.whiteSpace = 'pre-wrap';
    element.style.padding = '20px';
    element.style.fontSize = '16px';
    element.style.lineHeight = '1.6';
    element.style.width = '100%';
    element.textContent = responseText;

    // PDF options
    const opt = {
      margin: 0.5,
      filename: 'LeaveRequest.pdf',
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true, scrollY: 0 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Generate PDF and preview in new tab
    html2pdf()
      .set(opt)
      .from(element)
      .toPdf()
      .get('pdf')
      .then((pdf) => {
        const blob = pdf.output('blob');
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
      })
      .catch((err) => {
        console.error("PDF Generation Error:", err);
        alert("⚠️ Failed to preview PDF. Try again.");
      });
  };

  useEffect(() => {
    setReason(selectedReasons.join(' '));
  }, [selectedReasons]);


  const toggleEdit = () => {
    if (isEditing) {
      const updatedText = editableRef.current.innerText;
      setResponseText(updatedText);
    }
    setIsEditing(!isEditing);
  };

  return (
 
 <div className="max-w-xl mx-auto mt-2 p-4 bg-white rounded-2xl shadow-[0_0_25px_15px_rgba(128,0,130,0.5)] border relative overflow-hidden animated-border-glow">
   {/* <div className="max-w-xl mx-auto mt-3 p-4 bg-white rounded-2xl shadow-[0_0_25px_10px_rgba(128,0,130,0.5)] border"> */}
      <h2 className="text-xl font-bold text-center text-purple-700 ">Leave Request Assistant</h2>

{!showModal && (
      <form onSubmit={handleSubmit} className="space-y-1">
        <div className='flex gap-6 mt-2'>
          <label className="block mb-0 w-40 font-medium">Leave From :</label>
          <input
            type="date"
            className="w-30% border rounded-md  focus:outline-none bg-green-300
            focus:ring-2 hover:text-yellow-500 focus:ring-blue-400"
            value={leaveDate}
            onChange={(e) => setLeaveDate(e.target.value)}
            required
          />

          <label className="font-medium">To:</label>

           <input
            type="date"
            className="w-30% border rounded-md  py-1 focus:outline-none bg-green-300 
            focus:ring-2 hover:text-yellow-500 focus:ring-blue-700"
            value={leaveDate2}
            onChange={(e) => setLeaveDate2(e.target.value)}
            required
          />

        </div>

        <select
          className="w-full border rounded-md px-2 py-1 focus:outline-none 
          focus:ring-2 hover:text-red-500 focus:ring-blue-400"
          value={mail_id} // Select based on mail_id
          onChange={(e) => {
            const selectedEmail = e.target.value;
            const selectedPerson = mailto.find((p) => p.mailid === selectedEmail);
            if (selectedPerson) {
              setMailto(selectedPerson.name);
              setMail_id(selectedPerson.mailid);
            }
          }}
          required
        >
          <option value="">-- Select Recipient --</option>
          {mailto.map((person) => (
            <option key={person.mailid} value={person.mailid}>
              {person.name} ({person.mailid})
            </option>
          ))}
        </select>




        <div>

          <MultiReasonSelector
            selectedReasons={selectedReasons}
            setSelectedReasons={setSelectedReasons}
          />

          {/* ✅ Original Textarea stays */}
          <textarea
            rows={5}
            className="w-full border rounded-md px-3 py-2 focus:outline-none 
    focus:ring-2 hover:text-red-500 focus:ring-blue-400 text-xl text-red-500"
            placeholder="Type your reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />
        </div>




        <div className='flex gap-4'>
          <label className="block  font-medium">Size of content:</label>
          {/* <div className=" space-y-1 pl-2 text-sm text-gray-700"> */}
          {['5', '10', 'more than 10'].map((val) => (
            <label key={val} className="block">
              <input
                type="radio"
                name="size"
                value={val}
                className="mr-2"
                checked={size === val}
                onChange={(e) => setSize(e.target.value)}
              />
              {val === '>10' ? 'More than 10 lines' : `${val} lines`}
            </label>
          ))}
          {/* </div> */}
        </div>
      <div className='flex gap-10 '>
        <button
          type="submit"
          className="w-full bg-purple-400 hover:bg-yellow-500 
          text-white font-semibold py-2 rounded transition">
          Using Gemini
        </button>

        <button
          type="submit"
          className="w-full bg-green-400 hover:bg-yellow-500 
          text-white font-semibold py-2 rounded transition">
           Using ChatGPT
        </button>

        <button
          type="submit"
          className="w-full bg-blue-400 hover:bg-yellow-500 
          text-white font-semibold py-2 rounded transition">
          Using Deep Seek
        </button>
      </div>
      </form>
 )};

{/* </div> */}

      {/* Modal */}
      {showModal && (
//  <div className="max-w-1xl mx-auto mt-2 p-4 bg-white ">
 
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-10 w-full max-w-3xl">
            <h3 className="text-2xl font-bold mb-6 text-center text-green-600 flex justify-between items-center">
              Generated Leave Application
              <button
                onClick={handleMicToggle}
                className={`ml-4 text-2xl p-2 rounded-full transition ${speaking ? 'bg-red-200 text-red-700' : 'bg-yellow-200 text-yellow-700'
                  }`}
                title={speaking ? 'Stop Reading' : 'Read Aloud'}
              >
                <CiMicrophoneOn />
              </button>
            </h3>

            <div
              id="pdf-preview"
              ref={editableRef}
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              style={{

                whiteSpace: 'pre-wrap',
                padding: '16px',
                border: isEditing ? '1px solid #ccc' : 'none',
                fontSize: '16px',
                lineHeight: '1.4',
                outline: 'none',
                overflowY: 'auto',
                flexGrow: 1,
                maxHeight: '75vh',
              }} >
              {responseText}
            </div>



            {/* <div className="mt-6 flex justify-between gap-4 flex-wrap"> */}
            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={handleSendMail}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition"
              >
                ✉️ Send Mail
              </button>

              <button
                onClick={handlePrintPDF}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold py-3 rounded-xl shadow-lg transition"
              >
                🖨️ Print
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  window.speechSynthesis.cancel();
                  setSpeaking(false);
                }}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-lg font-semibold py-3 rounded-xl shadow-lg transition"
              >
                🔙 Back
              </button>

              <button
                onClick={toggleEdit}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {isEditing ? "Save" : "Final Correction"}
              </button>


            </div>




          </div>
        </div>
      )}

    </div>
  );
};

export default LeaveRequest;

