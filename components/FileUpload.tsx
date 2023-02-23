export default function FileUpload({onChange, onClick }) {
    return (
        <div>
          <div>
            <input type="file" onChange={onChange} />
            <div>
              <button onClick={onClick}>
                Upload
              </button>
            </div>
          </div>
        </div>
    )
  }