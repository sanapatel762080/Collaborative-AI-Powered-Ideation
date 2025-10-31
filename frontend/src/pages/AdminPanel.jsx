import React from "react";
import { Container, Alert } from "react-bootstrap";


export default function AdminPanel() {
return (
<Container className="mt-5">
<Alert variant="info">Admin Panel – Only accessible by Admins</Alert>
</Container>
);
}