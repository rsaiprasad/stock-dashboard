import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Import Tailwind CSS
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const App = () => {
  return (
    <div className="p-4"> {/* Add some padding for better visibility */}
      <Alert>
        <AlertTitle>Hello!</AlertTitle>
        <AlertDescription>
          Hello, world! This is a shadcn/ui Alert component.
        </AlertDescription>
      </Alert>
    </div>
  );
};

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}
const root = ReactDOM.createRoot(container);
root.render(<App />);
