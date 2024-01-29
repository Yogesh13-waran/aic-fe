import React, { useEffect, useState } from "react";
import { Switch, message, Card } from "antd";
import axios from "axios";

const { Meta } = Card;
const url="http://35.154.36.162:3103"

function formatTimestamp(date) {
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
  };

  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  return formattedDate.replace(/[/\s,:]+/g, "-").replace(/\s/g, ""); // Replace slashes, spaces, colons, and commas with hyphens and remove all spaces
}

function removeSpecialCharacters(text) {
  return text.replace(/[()\s]/g, ""); // Remove parentheses and spaces
}

const Slot = ({
  userDetails,
  selectedDate,
  slotExact,
  fetchDataForAvailability,
}) => {
  const [toggle, setToggle] = useState(false);
  const [slotData, setSlotData] = useState({});
  const [toggleDisable, setToggleDisable] = useState(false);
  const [uploadDisable, setUploadDisable] = useState(false);
  const [images, setImages] = useState([]);
  const [confirmedImages, setConfirmedImages] = useState([]);
  const [confirmImg, setConfirmImg] = useState("");
  const [user, setUser] = useState("");
  console.log(confirmImg, "confirmImg");

  const handleRemoveXrayImage = (index) => () => {
    const updatedXrayImages = [...images];
    updatedXrayImages.splice(index, 1);
    setImages(updatedXrayImages);
  };

  const onChangeToggle = async (checked) => {
    try {
      setToggle(checked);
      const year = selectedDate.slice(0, 4).toString();
      const month = selectedDate.slice(5, 7).toString();

      const response = await axios.post(`${url}/calendarpost`, {
        role: userDetails.role,
        slotUpdaterId: userDetails.created_id,
        date: selectedDate,
        time: slotExact,
        userId: userDetails._id,
        slotAvailability: checked,
        year: year,
        month: month,
      });
      console.log(response);
      fetchDataForAvailability();
    } catch {}
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userDetails.role === 1) {
          const response1 = await axios.get(
            `${url}/calendarcheck?date=${selectedDate}&time=${slotExact}&userId=${userDetails.created_id}`
          );
          //   console.log(response1.data.response.showUpload,"checking");
          setToggleDisable(response1.data.response.showToggle);
          setUploadDisable(response1.data.response.showUpload);
          setToggle(response1.data.response.slotData === null ? false : true);
          setSlotData(
            response1.data.response.mediaData === null
              ? null
              : response1.data.response.mediaData
          );
          setUser(response1.data.response.userData);
          message.success(response1.data.message);
        } else if (userDetails.role !== 1) {
          const response2 = await axios.get(
            `${url}/usercalendar?date=${selectedDate}&time=${slotExact}&userId=${userDetails.created_id}`
          );
          setUploadDisable(response2.data.response.showUpload);
          setSlotData(
            response2.data.response.mediaData === null
              ? null
              : response2.data.response.mediaData
          );
          setUser(response2.data.response.userData);


          message.success(response2.data.message);
        }
      } catch (error) {
        message.warning(error.response.data.message);
        setToggleDisable(error.response.data.response.showToggle);
        setUploadDisable(error.response.data.response.showUpload);
        setToggle(
          error.response.data.response.slotData === null ? false : true
        );
        setSlotData(
          error.response.data.response.mediaData === null
            ? null
            : error.response.data.response.mediaData
        );
        setUser(error.response.data.response.userData);

      }
    };

    fetchData();
  }, [selectedDate, slotExact]);

 

  const handleImageUpload = (event) => {
    const images = Array.from(event.target.files);
    const newImages = images.map((image) => ({
      file: image,
    }));
    setImages(newImages); // Set only the newImages array in the state
  };

  const handleConfirmImg = (imageObj, index) => async () => {
    const imageName = `${removeSpecialCharacters(
      imageObj.file.name
    )}-${formatTimestamp(imageObj.timestamp)}`;
    const formData = new FormData();
    formData.append("image", imageObj.file); // Append the entire File object
    try {
      const response = await axios.post(
        `${url}/upload`,
        formData
      );
     

      setConfirmedImages([...confirmedImages, imageObj]);
      setConfirmImg(response.data.mediaUrl);
      if (response.data.mediaUrl) {
        const response1 = await axios.post(
          `${url}/postcontent`,
          {
            role: userDetails.role,
            date: selectedDate,
            time: slotExact,
            uploaderId: userDetails.created_id,
            mediaUrl: response.data.mediaUrl,
          }
        );
        message.success(response1.data.message)
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const handleRefreshClick = () => {
    window.location.reload();
  };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
        <div style={{ width: "20%" }}>
          {/* upload div */}

          <div>
            <h3>Upload</h3>
            {userDetails.role === 1 && (
              <div
                className={
                  toggleDisable
                    ? "slot-update-container"
                    : "slot-update-container-disable"
                }
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <p>Slot Update</p>

                  <Switch
                    disabled={!toggleDisable}
                    defaultChecked={toggle}
                    value={toggle}
                    onClick={onChangeToggle}
                  />
                </div>
                {toggleDisable === true ? (
                  <p>Toggle to open/close slot </p>
                ) : (
                  <p>Toggle disabled</p>
                )}
              </div>
            )}
            <div
              className={
                uploadDisable
                  ? "upload-button-container"
                  : "upload-button-container-disable"
              }
            >
              <input
                type="file"
                accept="image/*,video/*"
                onChange={handleImageUpload}
                style={{ display: "none" }}
                id="imageInput"
                multiple
              />
              <label htmlFor="imageInput" className="upload-btn-img-over">
                <span>↑ </span> Upload
              </label>
            </div>
            {uploadDisable === true ? (
              <p style={{ color: "gray" }}>Click above to upload</p>
            ) : (
              <p>
                Upload is availble only for current time and already uploaded
                user
              </p>
            )}

            {images &&
              images.map((imageObj, index) => (
                <li
                  key={index}
                  className="mb-2 d-flex align-items-center gap-3"
                >
                  {imageObj.file &&
                    (imageObj.file.type.startsWith("image/") ? (
                      <img
                        style={{
                          width: "70px",
                          height: "70px",
                          borderRadius: "50%",
                        }}
                        src={URL.createObjectURL(imageObj.file)}
                        alt={`Image ${index}`}
                      />
                    ) : (
                      <video
                        style={{
                          width: "50px",
                          height: "50px",
                          borderRadius: "50%",
                        }}
                        controls
                      >
                        <source
                          src={URL.createObjectURL(imageObj.file)}
                          type={imageObj.file.type}
                        />
                        Your browser does not support the video tag.
                      </video>
                    ))}

                  {!confirmedImages.includes(imageObj) ? (
                    <>
                      <div>
                        <button
                          style={{
                            marginTop: "10px",
                            width: "100px",
                            height: "30px",
                            backgroundColor: "lightgreen",
                            border: "none",
                            borderRadius: "10px",
                            cursor: "pointer",
                            color: "white",
                          }}
                          className="confirm-img-btn"
                          onClick={handleConfirmImg(imageObj, index)}
                        >
                          Confirm
                        </button>
                      </div>
                      <button
                        style={{
                          marginTop: "10px",
                          width: "100px",
                          height: "30px",
                          backgroundColor: "coral",
                          border: "none",
                          borderRadius: "10px",
                          cursor: "pointer",
                          color: "white",
                        }}
                        className="remove-img-btn"
                        onClick={handleRemoveXrayImage(index)}
                      >
                        Remove
                      </button>
                    </>
                  ) : (
                    <h6
                      style={{
                        fontFamily: "Metropolis",
                        color: "#94BE7E",
                        marginLeft: "5px",
                        fontSize: "12px",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 32 32"
                        fill="none"
                      >
                        <path
                          d="M32 16C32 24.8366 24.8366 32 16 32C7.16344 32 0 24.8366 0 16C0 7.16344 7.16344 0 16 0C24.8366 0 32 7.16344 32 16Z"
                          fill="#94BE7E"
                        />
                        <path
                          d="M8 16.0002L12.8 20.8002L23.2 11.2002"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>{" "}
                      successfully Image uploaded
                    </h6>
                  )}
                </li>
              ))}
          </div>
          {uploadDisable && (
            <button
              onClick={handleRefreshClick}
              style={{
                marginTop: "10px",
                width: "100px",
                height: "30px",
                backgroundColor: "lightblue",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
                color: "white",
              }}
            >
              submit
            </button>
          )}
          {uploadDisable && (
            <p style={{ color: "gray" }}>
              submit here to confirm
              <br />
              the upload
            </p>
          )}
        </div>
        {/* view div */}
        <div style={{ width: "80%" }}>
          <h3>View</h3>
          <div className="card-content">
            {slotData !== null ? (
              <Card
                key={slotData._id} // Added key prop
                hoverable
                style={{
                  width: 540,
                }}
                // cover={<img src={slotData.contentmediaUrl} alt="example"/>}
                cover={
                  slotData.desc === "image" ? (
                    <img alt="example" src={slotData.contentmediaUrl} />
                  ) : (
                    <video controls width="500">
                      <source src={slotData.contentmediaUrl} />
                    </video>
                  )
                }
              >
                <Meta
                  title={
                    <>
                      uploaded by{" "}
                      {
                        <span style={{ fontWeight: "900", color: "blue" }}>
                          {" "}
                          {user.name}
                        </span>
                      }{" "}
                      on {slotData.contentDate} at {slotData.contentTimeSlot}
                    </>
                  }
                />{" "}
                {/* Added description */}
              </Card>
            ) : (
              "No Content uploaded to display"
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default Slot;
