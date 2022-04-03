import React from "react";

export default function Card({ name, picture, hitpoint }) {
  return (
    <div>
      <h2>{name}</h2>
      <img src={picture} alt="" />
      <p>{hitpoint}</p>
    </div>
  );
}
