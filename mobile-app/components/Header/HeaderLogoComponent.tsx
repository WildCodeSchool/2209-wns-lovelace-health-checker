import { Image } from "react-native";

const HeaderLogo = () => {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require("../../assets/images/logo.png")}
    />
  );
};

export default HeaderLogo;
