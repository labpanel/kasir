import { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const Toast = ({ message, type = 'success', onClose, duration = 2500 }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    const inTimer = setTimeout(() => setVisible(true), 10);
    // Auto dismiss
    const outTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 400);
    }, duration);

    return () => {
      clearTimeout(inTimer);
      clearTimeout(outTimer);
    };
  }, []);

  const bgMap = {
    success: 'bg-white border-green-400',
    error: 'bg-white border-red-400',
    info: 'bg-white border-blue-400',
  };

  return (
    <div className={`fixed top-6 right-6 z-[9999] flex items-start gap-3 px-5 py-4 rounded-2xl border-l-4 shadow-2xl max-w-sm transition-all duration-400
      ${bgMap[type]}
      ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
    `}>
      <div className="mt-0.5 shrink-0">{icons[type]}</div>
      <p className="text-gray-800 text-sm font-medium flex-1">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 400); }} className="text-gray-400 hover:text-gray-600 shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
