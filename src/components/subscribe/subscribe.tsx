import React, { useState, useRef } from "react";
import { Button, Input, message, Form } from "antd";
import styles from "./subscribe.module.css";
import Image from "next/image";

export const Subscribe = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const ref = useRef(null);

const handleSubscribe = async () => {
    if (!email) {
      message.error("Please enter your email address");
      return;
    }

setLoading(true);
    try {
      const recaptchaToken = await (await import("@lib/recaptcha-client")).getRecaptchaToken("SUBSCRIBE");
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, recaptchaToken, recaptchaAction: "SUBSCRIBE" }),
      });

if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to subscribe");
      }

message.success("Successfully subscribed to our newsletter!");
      setEmail("");
      form.resetFields();
    } catch (error) {
      console.error("Subscription error:", error);
      message.error(
        error instanceof Error
          ? error.message
          : "Failed to subscribe. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

return (
    <section id="subscribe" ref={ref} className={`section ${styles.section}`}>
      <div className="container">
        <div className={styles.content}>
          <h1 className={styles.heading}>Subscribe.</h1>
          <p className={styles.subheading}>
            Sign up for our marketing notifications.
          </p>
          <Form
            form={form}
            onFinish={handleSubscribe}
            className={styles.form}
          >
            <Input
              placeholder="Your email address"
              size="large"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              style={{
                borderRadius: 30,
              }}
              type="email"
              required
            />
            <Button
              size="large"
              className={styles.button}
              shape="round"
              style={{ backgroundColor: "#32CD32", color: "#fff" }}
              htmlType="submit"
              loading={loading}
            >
              Subscribe
            </Button>
          </Form>
          <Image
            height={250}
            width={100}
            src="/img/pattern/pattern-4.svg"
            alt="pattern image"
            className={styles.pattern}
          />
        </div>
      </div>
    </section>
  );
};

export default Subscribe;
