import { useFetcher } from '@remix-run/react';
import { useEffect, useRef, useState } from 'react';

//PrimeReact
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export default function Index() {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  let fetcher = useFetcher();
  const ref = useRef<HTMLFormElement>(null);
  const titleRef = useRef<InputText>(null);
  const toast = useRef(null);

  useEffect(() => {
    if (fetcher.data?.error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: fetcher.data.error, life: 3000 });
    } else if (fetcher.data?.ok) {
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Product Added', life: 3000 });
      setTitle("");
      setPrice("");
      setDescription("");
      setCategory("");
      titleRef.current?.focus();
    }
  }, [fetcher.data]);

  return (
    <Card title="Toast Example"
      style={{ margin: "0 auto" }}
      className="col-10 md:col-6 lg:col-4 mt-6">
      <Toast ref={toast} />
      <div className="text-center">
        <h1>Add Product</h1>
      </div>
      <div>
        <fetcher.Form
          replace
          ref={ref}
          action="/actions/addProduct"
          method="post">
          <div className="col mb-2">
            <span className="p-float-label">
              <InputText id="title"
                autoFocus
                name="title"
                ref={titleRef}
                value={title}
                className="w-full"
                onChange={(e) => setTitle(e.target.value)} />
              <label htmlFor="title">Title</label>
            </span>
          </div>
          <div className="col mb-2">
            <span className="p-float-label">
              <InputText id="price"
                name="price"
                value={price}
                className="w-full"
                onChange={(e) => setPrice(e.target.value)} />
              <label htmlFor="price">Price</label>
            </span>
          </div>
          <div className="col mb-2">
            <span className="p-float-label">
              <InputText id="description"
                name="description"
                value={description}
                className="w-full"
                onChange={(e) => setDescription(e.target.value)} />
              <label htmlFor="description">Description</label>
            </span>
          </div>
          <div className="col mb-2">
            <span className="p-float-label">
              <InputText id="category"
                name="category"
                value={category}
                className="w-full"
                onChange={(e) => setCategory(e.target.value)} />
              <label htmlFor="category">Category</label>
            </span>
          </div>
          <div className="col text-center">
            <Button label={fetcher.state === "submitting" ? "Submitting..." : "Submit"}
              type="submit"
              aria-label="Submit"
              icon="pi pi-check"
              disabled={fetcher.state === "submitting"}
            />
          </div>
        </fetcher.Form>
      </div>
    </Card>
  );
}
