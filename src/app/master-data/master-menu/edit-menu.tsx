import { useParams } from '@tanstack/react-router';

export function EditMenu() {
  const { id } = useParams({ from: '/detail/$id' });

  return (
    <div>
      <h1>Detail Page</h1>
      <p>ID: {id}</p>
    </div>
  );
}