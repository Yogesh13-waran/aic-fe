import React, { useEffect, useState } from "react";
import { Calendar, Modal, Badge } from "antd";
import "../../App.css";
import axios from "axios";
import Slot from "../slot/slot";
import { Avatar, Popover, Button, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const url="http://35.154.36.162:3103"

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const navigate = useNavigate();

  const formattedDate = `${year}-${month}-${day}`;

  // usestates
  const [selectedDate, setSelectedDate] = useState(formattedDate);
  const [slotAvailability, setSlotAvailability] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [slotExact, setSlotExact] = useState("");

  const userDetails = JSON.parse(localStorage.getItem("credentials"));

  // Slots
  const slots = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const dateFullCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const eventList = events[formattedDate];
console.log(eventList)
    let eventCount = 0;
    if (eventList) {
      eventCount = eventList.length;
    }

    return (
      <div>
        {eventCount > 0 && (
          <Badge
            count={eventCount}
            style={{
              backgroundColor: "#52c41a",
              color: "#52c41a",
              width: "10px",
            }}
          />
        )}
      </div>
    );
  };

// call api while clicking events
  const onSelect = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const eventList = events[formattedDate];

    setSelectedDate(formattedDate);
    setSelectedEvents(eventList || []);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleClickForSlot = (slot) => {
    setIsModalVisible(true);
    setSlotExact(slot);
  };

  const fetchDataForAvailability = async () => {
    try {
      const responseAvailability = await axios.get(
        `${url}/openslot?date=${selectedDate}`
      );
      setSlotAvailability(responseAvailability.data.data);
    } catch (error) {
      setSlotAvailability([]);
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/slotinfo`);
        setSlotData(response.data.data);
      } catch (error) {
        alert("Try again later")
      }
    };

    //availability slot checking
    
    fetchData();
    fetchDataForAvailability();
  }, [selectedDate]);

  // console.log(slotAvailability,"slotttttt");
  const events = {};
  slotData &&
    slotData.forEach((data) => {
      events[data.date] = [{ content: "Slot Opened" }];
    });

  return (
    <>
      <div className="logo-home">
        <Popover
          content={
            <>
              <Button onClick={() => navigate("/mypost")}>My Posts</Button>
              <Button onClick={() => navigate("/")}>Logout</Button>
            </>
          }
          title="Your Profile"
        >
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          >
            {userDetails && (
              <p style={{ fontWeight: "700", margin: "6px", fontSize: "11px" }}>
                {userDetails.name}
                <br />
                {userDetails.role === 1 ? "Admin" : "User"}
              </p>
            )}
            <Avatar
              style={{ backgroundColor: "#87d068", marginRight: "30px" }}
              icon={<UserOutlined />}
            />
          </div>
        </Popover>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "55%" }}>
          <Calendar cellRender={dateFullCellRender} onSelect={onSelect} />
        </div>
        <div
          style={{
            width: "40%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <div
            style={{
              display: "flex",

              gap: "20px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Tooltip title="This Shows the Avaliable Slots for the Day">
              <p style={{ width: "70%" }} className="slot-header-btn">
                Slots
              </p>
            </Tooltip>
          </div>
          {slots.map((slot, index) => (
          
            <div style={{ display: "flex",gap: "50px", alignItems: "center" }}>
              <button
                key={index}
                onClick={() => handleClickForSlot(slot)}
                className="slot-btn-home"
                style={{
                  backgroundColor:
                    slotAvailability &&
                    slotAvailability
                      .map((availability) => availability.timeSlot)
                      .includes(slot)
                      ? "#5dade2"
                      : "rgb(246, 246, 247)",
                }}

          
              >
                {slot}
              </button>
            </div>
          ))}
        </div>
        {/* model code for slots adding */}
        <Modal
          title={`Slot of ${selectedDate} at ${slotExact}`}
          open={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Slot
            userDetails={userDetails}
            selectedDate={selectedDate}
            slotExact={slotExact}
            fetchDataForAvailability={fetchDataForAvailability}
          />
        </Modal>
      </div>
    </>
  );
};

export default Home;
