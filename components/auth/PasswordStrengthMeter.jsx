const getPasswordStrength = (password) => {
  if (!password) return 0;
  let score = 1;
  if (password.length > 5) score++;
  if (password.length > 7) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const getPasswordFeedback = (password) => {
  const feedback = [];
  if (!password) return ["Enter your password"];
  if (password.length < 6) feedback.push("Make password longer");
  if (!/[A-Z]/.test(password)) feedback.push("Add uppercase letter");
  if (!/[0-9]/.test(password)) feedback.push("Add number");
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push("Add symbol");
  if (feedback.length === 0) return ["Strong password"];
  return feedback;
};

const colors = ["#ff0000", "#ff9900", "#ffff00", "#dada03", "#288654", '#00cdf6'];

export default function PasswordStrengthMeter ({ password }) {
  const strength = getPasswordStrength(password);
  const feedbackMessages = getPasswordFeedback(password);
  const steps = 6;

  return (
    <>
      <div className="w-full h-[4px] rounded-2xl bg-white overflow-hidden my-2 flex ">
        {[...Array(steps)].map((_, idx) => {
          const active = idx < strength;
          return (<div key={idx} className="flex-1 mx-[2px] rounded-2xl transition-colors duration-300 strengthRange" style={{ backgroundColor: active ? colors[idx] : "#808080" }}/>);
        })}
      </div>
      <div style={{ color: colors[strength - 1] || "#fff", fontSize: "0.85rem", minHeight: "18px", userSelect: "none",}}>
        <ul className="grid content-center justify-items-start gap-1 m-2">
          {feedbackMessages.map((msg, idx) => (<li key={idx} className="bg-red-400 p-1 rounded-2xl w-max text-white">{msg}</li>))}
        </ul>
      </div>
    </>
  );
};