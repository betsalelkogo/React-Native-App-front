import { FC, useContext, useState } from "react";
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Badge, TextInput } from "react-native-paper";

import { AuthContext } from "../../context/AuthContext";

import { theme } from "../Core/theme";

// @ Custom Components
import Button from "../Shared/Button";
import AppLoading from "../Shared/AppLoading";
import AppImagePicker from "../Shared/ImagePicker";
import AllPosts from "../Post/PostsList";
import PostApi from "../../api/PostApi";
import UserImagePicker from "../Shared/ImagePickerUser";

const MyProfileScreen: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const {
    logout,
    isLoading,
    userInfo,
    getUserInfo,
    userData,
    editUserInfo,
    toggleLoading,
  } = useContext(AuthContext);

  const [image, setImage] = useState<string>(userData?.avatarUrl || "");

  const [editName, setEditName] = useState<string>(userData?.name || "");
  const [editEmail, setEditEmail] = useState<string>(userData?.email || "");

  const [errMsg, setErrMsg] = useState<string>("");

  const [editMode, setEditMode] = useState<boolean>(false);

  const handleCreatePost = (postId?: string) => {
    navigation.navigate("Add Post", {
      postId,
    });
  };

  const handleEditUser = async () => {
    if (!editName) {
      setErrMsg("Name cannot be empty");
      return;
    }
    toggleLoading();
    let avatarUrl: string | false = false;
    if (image) {
      avatarUrl = await PostApi.uploadImage(image, userInfo.id);
    }

    const res = editUserInfo(userInfo.id, {
      avatarUrl: avatarUrl || "",
      name: editName,
    });
    toggleLoading();
  };

  const onRefresh = () => getUserInfo(userInfo.id);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.infoContainer}>
        <UserImagePicker
          image={image}
          setImage={(image: string) => setImage(image)}
          hideBtns={!editMode}
          disabled={isLoading}
        />

        {editMode ? (
          <View style={{ alignContent: "center", marginTop: 10 }}>
            <TextInput
              value={editName}
              onChangeText={(text) => setEditName(text)}
              style={styles.textInput}
              disabled={isLoading}
            />
            <TextInput
              value={editEmail}
              onChangeText={(text) => setEditEmail(text)}
              style={styles.textInput}
              disabled={isLoading}
            />
          </View>
        ) : (
          <View style={{ alignContent: "center", marginTop: 10 }}>
            <Text>User Name: {userData?.name || ""}</Text>
            <Text>User Email: {userData?.email || ""}</Text>
          </View>
        )}
        {errMsg && <Text style={{ color: theme.colors.error }}>{errMsg}</Text>}
        <View style={styles.btnContainer}>
          <Button
            title={editMode ? "Cancel" : "Logout"}
            onPress={editMode ? () => setEditMode(false) : logout}
            style={styles.btn}
            color={isLoading ? theme.colors.darkGrey : undefined}
          />
          <Button
            title={editMode ? "Save" : "Edit User"}
            onPress={() => {
              if (editMode) {
                handleEditUser();
              }
              setEditMode((prevState) => !prevState);
            }}
            style={styles.btn}
            color={isLoading ? theme.colors.darkGrey : undefined}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.postsContainer}
        refreshControl={
          <RefreshControl refreshing={isLoading} onRefresh={onRefresh} />
        }
      >
        <AllPosts
          posts={userData?.posts || []}
          navToCreatePost={handleCreatePost}
          title="My Posts"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 0.95,
  },
  btnContainer: {
    flexDirection: "row",
  },
  btn: {
    margin: 5,
  },
  infoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  postsContainer: {
    justifyContent: "center",
  },
  textInput: {
    backgroundColor: theme.colors.snowWhite,
    width: "70%",
  },
});

export default MyProfileScreen;
