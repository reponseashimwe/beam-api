import { User } from "@prisma/client";

export default function Avatar({
  user,
  bg = "bg-white",
}: {
  user?: User;
  bg?: string;
}) {
  const img = false;
  const name = `${user?.name}`;

  const GetFirstLetters = () => {
    return user?.name
      ?.split(" ")
      .splice(0, 1)
      .map((part) => part[0])
      .join("");
  };

  if (!user) return <></>;

  return (
    <div
      className={`flex ${bg} flex-shrink-0 justify-center items-center size-12 [&>*]:size-full rounded-md [&>*]:text-lg [&>*]:font-semibold`}
    >
      {img ? (
        <img loading="lazy" className="object-cover" src={img} />
      ) : (
        <span className="back-current flex items-center justify-center uppercase text-blue">
          {GetFirstLetters()}
        </span>
      )}
    </div>
  );
}
