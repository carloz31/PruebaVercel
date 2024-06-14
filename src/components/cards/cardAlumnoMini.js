import React from "react";
import { Avatar, Card, Typography } from "antd";
const { Meta } = Card;
const { Text } = Typography;

export default function CardAlumnoMini({ nombre, apellido, codigo }) {
  const avatarText = `${nombre.charAt(0)}${apellido.charAt(0)}`;

  return (
    <>
      <Card
        style={{
          width: "100%",
          height: 80,
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
          fontFamily: "Nunito, sans-serif",
          color: "black", // Add this line to set the text color to black
        }}
      >
        <Meta
          avatar={
            <Avatar
              style={{
                backgroundColor: "lightgray",
                marginLeft: "0px",
                alignConten: "left",
                fontSize: "24px",
                width: "50px",
                height: "50px",
                color: "black",
              }}
            >
              {avatarText}
            </Avatar>
          }
          description={
            // Replace 'data' with 'description'
            <>
              <Text style={{ textAlign: "left" }}>
                <strong>
                  {nombre} {apellido}
                </strong>
              </Text>
              <br />
              <Text style={{ textAlign: "left" }}>{codigo}</Text>
            </>
          }
        />
      </Card>
    </>
  );
}
