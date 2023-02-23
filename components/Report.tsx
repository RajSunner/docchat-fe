import Link from 'next/link'
type Report = {
  name: string;
  url: string;
};

const Report = ({ name, url }: Report) => (
  <Link
    href={`/chat/${encodeURIComponent(name)}?name=${encodeURIComponent(name)}&url=${encodeURIComponent(url)}`}
    className="mt-6 w-96 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600"
  >
    <h3 className="text-2xl font-bold">{name} &rarr;</h3>
    <p className="mt-4 text-xl">{url}</p>
  </Link>
);

export default function ReportList({ reports }: any) {
  return (
    <>
      {reports.map((item: any) => (
        <Report key={item.id + item.url} name={item.name} url={item.url} />
      ))}
    </>
  );
}
