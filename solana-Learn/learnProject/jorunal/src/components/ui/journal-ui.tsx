export function JournalCreate() {
    const { createEntry } = useJournalProgram();
    const { publicKey } = useWallet();
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
  
    const isFormValid = title.trim() !== "" && message.trim() !== "";
  
    const handleSubmit = () => {
      if (publicKey && isFormValid) {
        createEntry.mutateAsync({ title, message, owner: publicKey });
      }
    };
  
    if (!publicKey) {
      return <p>Connect your wallet</p>;
    }
  
    return (
      <div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input input-bordered w-full max-w-xs"
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="textarea textarea-bordered w-full max-w-xs"
        />
        <br></br>
        <button
          type="button"
          className="btn btn-xs lg:btn-md btn-primary"
          onClick={handleSubmit}
          disabled={createEntry.isPending || !isFormValid}
        >
          Create Journal Entry {createEntry.isPending && "..."}
        </button>
      </div>
    );
  }

  function JournalCard({ account }: { account: PublicKey }) {
    const { accountQuery, updateEntry, deleteEntry } = useJournalProgramAccount({
      account,
    });
    const { publicKey } = useWallet();
    const [message, setMessage] = useState("");
    const title = accountQuery.data?.title;
  
    const isFormValid = message.trim() !== "";
  
    const handleSubmit = () => {
      if (publicKey && isFormValid && title) {
        updateEntry.mutateAsync({ title, message, owner: publicKey });
      }
    };
  
    if (!publicKey) {
      return <p>Connect your wallet</p>;
    }
  
    return accountQuery.isLoading ? (
      <span className="loading loading-spinner loading-lg"></span>
    ) : (
      <div className="card card-bordered border-base-300 border-4 text-neutral-content">
        <div className="card-body items-center text-center">
          <div className="space-y-6">
            <h2
              className="card-title justify-center text-3xl cursor-pointer"
              onClick={() => accountQuery.refetch()}
            >
              {accountQuery.data?.title}
            </h2>
            <p>{accountQuery.data?.message}</p>
            <div className="card-actions justify-around">
              <textarea
                placeholder="Update message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="textarea textarea-bordered w-full max-w-xs"
              />
              <button
                className="btn btn-xs lg:btn-md btn-primary"
                onClick={handleSubmit}
                disabled={updateEntry.isPending || !isFormValid}
              >
                Update Journal Entry {updateEntry.isPending && "..."}
              </button>
            </div>
            <div className="text-center space-y-4">
              <p>
                <ExplorerLink
                  path={`account/${account}`}
                  label={ellipsify(account.toString())}
                />
              </p>
              <button
                className="btn btn-xs btn-secondary btn-outline"
                onClick={() => {
                  if (
                    !window.confirm(
                      "Are you sure you want to close this account?",
                    )
                  ) {
                    return;
                  }
                  const title = accountQuery.data?.title;
                  if (title) {
                    return deleteEntry.mutateAsync(title);
                  }
                }}
                disabled={deleteEntry.isPending}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }  