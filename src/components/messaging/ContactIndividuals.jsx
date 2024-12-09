

const ContactIndividuals = ({userId, onClickk, selectedContact, username, online}) => {
    return (
        <div className={" border-y-2 border-neutral-600 flex items-center cursor-pointer relative" + ((userId === selectedContact) ? " bg-neutral-600" : "")} key={userId}>
            { (userId === selectedContact) && <div className="h-full bg-slate-200 w-[2px] ml-1"></div>}
            <div className="p-2 flex items-center">
                <div className=" relative bg-green-700 aspect-square p-2 w-full h-full rounded-full" >pp</div>
                <div className="ml-4 text-xl">{username}</div>
            </div>
        </div>
    )
}

export default ContactIndividuals