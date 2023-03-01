import { HOMEPAGE_ROUTE } from "../../routes";
import { bootstrap } from "../../styles/bootstrapConvert";
import { styles } from "./FooterStyle";
import { View, Text, FlatList } from "react-native";
import { Link } from "@react-navigation/native";

const DATA = [
  {
    link: HOMEPAGE_ROUTE,
    text: "Legals",
  },
  { link: HOMEPAGE_ROUTE, text: "Terms of use" },
  {
    link: HOMEPAGE_ROUTE,
    text: "Sales and refunds",
  },
];

const Footer = () => {
  return (
    <View style={[bootstrap.dFlex, bootstrap.flexColumn, bootstrap.justifyContentCenter, styles.footer]}>
      <View style={{}}>
        <FlatList
          style={[styles.flatlist]}
          data={DATA}
          renderItem={({ item }) => (
            <Link style={{}} to={item.link}>
              <Text style={[styles.p, styles.link]}>{item.text}</Text>
            </Link>
          )}
        ></FlatList>
        <Text style={[styles.copyright]}>©2022 Health Check</Text>
      </View>
    </View>
  );
};

export default Footer;
