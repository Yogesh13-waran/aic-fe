import React, { useEffect, useState } from "react";
import { Avatar, Popover, Button, Card } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Meta } = Card;

const Mypost = () => {
  const navigate = useNavigate();
  const userDetails = JSON.parse(localStorage.getItem("credentials"));
  const [myPostData, setMypostData] = useState([]);
  const [resultMessage, setResultMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:7000/allcontent?userId=${userDetails.created_id}`
        );
        setMypostData(response.data.response);
      } catch (error) {
        setResultMessage(error.response.data.message);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="logo-home">
        <Popover
          content={
            <>
              <Button onClick={() => navigate("/calendar")}>Home</Button>
              <Button onClick={() => navigate("/")}>Logout</Button>
            </>
          }
          title="Your Profile"
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            {userDetails && (
              <p
                style={{
                  fontWeight: "700",
                  margin: "6px",
                  fontSize: "11px",
                }}
              >
                {userDetails.name}
                <br />
                {userDetails.role === 1 ? "Admin" : "User"}
              </p>
            )}
            <Avatar
              style={{
                backgroundColor: "#87d068",
                marginRight: "30px",
              }}
              icon={<UserOutlined />}
            />
          </div>
        </Popover>
      </div>
      <div>
        <p
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            backgroundColor: "rgb(219, 243, 219)",
            fontWeight: "800",
          }}
        >
          My Posts
        </p>
      </div>
      <div>
        {resultMessage ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100vh",
            }}
          >
            {resultMessage}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              padding: "10px",
            }}
          >
            {myPostData &&
              myPostData.map((post, index) => {
                const imgFinal = post.contentmediaUrl;
                const content = post.desc; // Removed file:/// prefix
                return (
                  <Card
                    key={index} // Added key prop
                    hoverable
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "30vw",
                      margin: "10px",
                    }}
                    cover={
                      content === "image" ? (
                        <img alt="example" src={imgFinal} />
                      ) : (
                        <video controls width="240">
                          <source src={imgFinal} />
                        </video>
                      )
                    }
                  >
                    <Meta
                      title={
                        <>
                          {post.contentDate} at {post.contentTimeSlot}
                        </>
                      }
                    />{" "}
                    {/* Added description */}
                  </Card>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
};
export default Mypost;
