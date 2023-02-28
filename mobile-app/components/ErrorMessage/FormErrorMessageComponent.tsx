import { ErrorMessage } from "@hookform/error-message";
import { View, Text } from "react-native";
import { bootstrap } from "../../styles/bootstrapConvert";
import { variables } from "../../styles/variables";
import { styles } from "./FormErrorMessageStyle";

const FormErrorMessage = ({ errors, name }: { errors: any; name: string }) => {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ messages }) =>
        messages &&
        Object.entries(messages).map(([type, message]) => (
          <View key={type} style={[{ top: 60 }, bootstrap.dFlex]}>
            <Text style={[styles.errorMessage]}>{message}</Text>
          </View>
        ))
      }
    />
  );
};
export default FormErrorMessage;
