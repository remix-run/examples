import { Button } from 'primereact/button';
import { useState, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

export default function Index() {
  const toast = useRef<Toast>(null);
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState<boolean>(false);

  const showSuccess = () => {
    toast.current?.show({
      severity: 'success',
      summary: 'Success',
      detail: 'Message Content',
      life: 3000,
    });
  };

  const showInfo = () => {
    toast.current?.show({
      severity: 'info',
      summary: 'Info',
      detail: 'Message Content',
      life: 3000,
    });
  };

  const showWarn = () => {
    toast.current?.show({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Message Content',
      life: 3000,
    });
  };

  const showError = () => {
    toast.current?.show({
      severity: 'error',
      summary: 'Error',
      detail: 'Message Content',
      life: 3000,
    });
  };

  return (
    <>
      {/* Button */}
      <div className="text-center">
        <h1>Button</h1>
        <Button
          label="Click"
          icon="pi pi-plus"
          onClick={(e) => setCount(count + 1)}
        ></Button>
        <div className="text-2xl text-900 mt-3">{count}</div>
      </div>
      {/* Toast */}
      <Toast ref={toast} />
      <div className="text-center">
        <h1>Toast</h1>
      </div>
      <div className="card flex justify-content-center mt-3">
        <div className="flex flex-wrap gap-2">
          <Button
            label="Success"
            className="p-button-success"
            onClick={showSuccess}
          />
          <Button label="Info" className="p-button-info" onClick={showInfo} />
          <Button
            label="Warn"
            className="p-button-warning"
            onClick={showWarn}
          />
          <Button
            label="Error"
            className="p-button-danger"
            onClick={showError}
          />
        </div>
      </div>
      {/* Dialog */}
      <div className="text-center">
        <h1>Dialog</h1>
      </div>
      <div className="card flex justify-content-center mt-3">
        <Button
          label="Show"
          icon="pi pi-external-link"
          onClick={() => setVisible(true)}
        />
        <Dialog
          header="Header"
          visible={visible}
          style={{ width: '50vw' }}
          onHide={() => setVisible(false)}
        >
          <p className="m-0">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
        </Dialog>
      </div>
    </>
  );
}
