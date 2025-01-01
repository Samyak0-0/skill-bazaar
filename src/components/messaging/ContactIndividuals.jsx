import Image from "next/image";

const ContactIndividuals = ({
  userId,
  onClickk,
  selectedContact,
  username,
  online,
  imgurl,
}) => {
  return (
    <div
      className={
        "  flex items-center cursor-pointer relative" +
        (userId === selectedContact ? " bg-neutral-600" : "")
      }
      key={userId}
    >
      {/* {userId === selectedContact && (
        <div className="h-full bg-slate-200 w-[2px] ml-1"></div>
      )} */}
      <div className="p-2 flex items-center">
        <Image
          src={imgurl}
          width={50}
          height={50}
          alt={imgurl}
          className="rounded-full"
        />

        <div className="ml-4">{username}</div>
      </div>
    </div>
  );
};

export default ContactIndividuals;
