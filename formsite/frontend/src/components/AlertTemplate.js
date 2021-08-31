import React from 'react';

const AlertTemplate = ({ style, options, message, close }) => (
    <div style={style} className={options.type === 'success' && "bg-green-500 px-4 py-2 text-xl text-white font-medium rounded-lg"}>
      {message}
    </div>
)

export default AlertTemplate;