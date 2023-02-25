import Link from "next/link";
type Report = {
  name: string;
  url: string;
  fname: string;
};

const Report = ({ name, url, fname }: Report) => (
  <Link
    href={`/chat/${encodeURIComponent(name)}?name=${encodeURIComponent(
      name
    )}&url=${encodeURIComponent(url)}&fname=${encodeURIComponent(fname)}`}
    className="rounded-xl border p-3 hover:text-blue-600 focus:text-blue-600"
  >
    {name}
  </Link>
);

export default function ReportList({ reports }: any) {
  return (
    <div className="max-w-sm my-5 mx-auto flex flex-col gap-3 text-center">
      {reports.map((item: any) => (
        <Report key={item.id + item.url} name={item.name} url={item.url} fname={item.fname} />
      ))}
    </div>
  );
}
