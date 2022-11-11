import { json } from '@remix-run/node';

export async function action({ request }) {
  let formData = await request.formData();
  //Valores
  const title = formData.get('title');
  const price = formData.get('price');
  const description = formData.get('description');
  const category = formData.get('category');
  //Validaciones
  if (title === '' || title.trim() === '') {
    return json({ error: 'Tittle is empty' });
  }
  if (price === '' || price.trim() === '') {
    return json({ error: 'Price is empty' });
  }
  if (description === '' || description.trim() === '') {
    return json({ error: 'Description is empty' });
  }
  if (category === '' || category.trim() === '') {
    return json({ error: 'Category is empty' });
  }
  try {
    await fetch('https://fakestoreapi.com/products', {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        price: price,
        description: description,
        image: 'https://i.pravatar.cc',
        category: category,
      }),
    });
    return json({ ok: true });
  } catch (error) {
    return json({ error: error.message });
  }
}
