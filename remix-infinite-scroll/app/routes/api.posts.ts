import { json } from '@remix-run/node';
import type { LoaderFunctionArgs } from '@remix-run/node';

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const page = Number(url.searchParams.get('page')) || 1;
  const limit = Number(url.searchParams.get('limit')) || 10;

  // 模拟从数据库获取数据
  const start = (page - 1) * limit;
  const posts = Array.from({ length: limit }, (_, i) => ({
    id: start + i + 1,
    title: `Post ${start + i + 1}`,
    content: `Content ${start + i + 1}`,
    author: 'Author'
  }));

  // 模拟总共有50篇文章
  const hasMore = start + limit < 50;

  return json({
    posts,
    nextPage: hasMore ? page + 1 : null
  });
}