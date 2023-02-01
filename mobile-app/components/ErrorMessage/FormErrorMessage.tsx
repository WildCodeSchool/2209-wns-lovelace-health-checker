import { ErrorMessage } from "@hookform/error-message";
import { View, Text } from "react-native";

const FormErrorMessage = ({ errors, name }: { errors: any; name: string }) => {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ messages }) =>
        messages &&
        Object.entries(messages).map(([type, message]) => (
          <View key={type} style={{display: "flex"}}>
            
            <Text>{message}</Text>
          </View>
        ))
      }
    />
  );
};
export default FormErrorMessage;
