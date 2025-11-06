import React from "react";
import { Input, Select, Space, Tooltip, Tag } from "antd";
import { PhoneOutlined, InfoCircleOutlined } from "@ant-design/icons";
import {
  AFRICAN_COUNTRY_CODES,
  DEFAULT_COUNTRY,
  CountryCode,
} from "@utils/country-codes";

const { Option } = Select;

interface PhoneNumberInputProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  size?: "small" | "middle" | "large";
  disabled?: boolean;
  showMoneyServices?: boolean;
  countryCode?: string;
  onCountryCodeChange?: (countryCode: string) => void;
  style?: React.CSSProperties;
  className?: string;
  error?: boolean;
  errorMessage?: string;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  value = "",
  onChange,
  placeholder = "Enter phone number",
  size = "large",
  disabled = false,
  showMoneyServices = true,
  countryCode = DEFAULT_COUNTRY.code,
  onCountryCodeChange,
  style,
  className,
  error = false,
  errorMessage = "Please enter a valid phone number",
}) => {
  const [internalCountryCode, setInternalCountryCode] =
    React.useState(countryCode);
  const [isInitialized, setIsInitialized] = React.useState(false);

  const selectedCountry =
    AFRICAN_COUNTRY_CODES.find(
      (country) => country.code === internalCountryCode
    ) || DEFAULT_COUNTRY;

  React.useEffect(() => {
    if (!isInitialized && !value && onChange) {
      const initialCountry =
        AFRICAN_COUNTRY_CODES.find((c) => c.code === countryCode) ||
        DEFAULT_COUNTRY;

      onChange(`${initialCountry.phonePrefix} `);
      setIsInitialized(true);
    }
  }, [countryCode, value, onChange, isInitialized]);

  const handleCountryChange = (newCountryCode: string) => {
    setInternalCountryCode(newCountryCode);

    if (onCountryCodeChange) {
      onCountryCodeChange(newCountryCode);
    }

    const newCountry = AFRICAN_COUNTRY_CODES.find(
      (c) => c.code === newCountryCode
    );

    if (newCountry && onChange) {
      let cleanNumber = value.replace(/^\+\d+\s*/, "").trim();
      const numberWithPrefix = cleanNumber
        ? `${newCountry.phonePrefix} ${cleanNumber}`
        : `${newCountry.phonePrefix} `;
      onChange(numberWithPrefix);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (onChange) {
      onChange(inputValue);
    }
  };

  const renderCountryOption = (country: CountryCode) => (
    <Option key={country.code} value={country.code}>
      <Space align="center" size={4}>
        <span style={{ fontSize: "16px" }}>{country.flag}</span>
        <span>{country.code}</span>
        <span style={{ color: "#999", fontSize: "12px" }}>
          {country.phonePrefix}
        </span>
        {showMoneyServices && country.mtnMoney && (
          <Tag color="blue" style={{ margin: 0 }}>
            MTN
          </Tag>
        )}
        {showMoneyServices && country.orangeMoney && (
          <Tag color="orange" style={{ margin: 0 }}>
            Orange
          </Tag>
        )}
      </Space>
    </Option>
  );
  // Custom select display
  const selectDisplayRender = () => (
    <Space align="center" size={4}>
      <span style={{ fontSize: "16px" }}>{selectedCountry.flag}</span>
      <span style={{ fontWeight: 500 }}>{selectedCountry.code}</span>
      <span style={{ color: "#999", fontSize: "13px" }}>
        {selectedCountry.phonePrefix}
      </span>
    </Space>
  );

  return (
    <div style={{ width: "100%", ...style }} className={className}>
      <Input.Group
        compact
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          borderRadius: "8px",
          border: error ? "1px solid #ff4d4f" : "1px solid #d9d9d9",
          overflow: "hidden",
        }}
      >
        <Select
          value={internalCountryCode}
          onChange={handleCountryChange}
          style={{
            width: "120px",
            border: "none",
            borderRight: "1px solid #d9d9d9",
          }}
          size={size}
          disabled={disabled}
          showSearch
          filterOption={(input, option) => {
            const country = AFRICAN_COUNTRY_CODES.find(
              (c) => c.code === option?.value
            );
            return country
              ? country.name.toLowerCase().includes(input.toLowerCase()) ||
                  country.phonePrefix.includes(input)
              : false;
          }}
          suffixIcon={null}
          dropdownMatchSelectWidth={200}
        >
          {AFRICAN_COUNTRY_CODES.map(renderCountryOption)}
        </Select>

        <Input
          value={value}
          onChange={handlePhoneChange}
          placeholder={placeholder}
          prefix={<PhoneOutlined style={{ color: "#999" }} />}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            boxShadow: "none",
          }}
          size={size}
          disabled={disabled}
        />
      </Input.Group>

      {error && errorMessage && (
        <div
          style={{
            color: "#ff4d4f",
            fontSize: "14px",
            marginTop: "4px",
            marginLeft: "2px",
          }}
        >
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default PhoneNumberInput;