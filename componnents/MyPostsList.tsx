import { FC, useState, useEffect } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  Alert,
  TextInput,
  FlatList,
  TouchableHighlight,
} from "react-native";

import PostModel, { Post } from "../model/PostModel";

const ListItem: FC<{
  id: String;
  detail: String;
  title: String;
  image: String;
  onRowSelected: (id: String) => void;
}> = ({ title, id, detail, image, onRowSelected }) => {
  const onClick = () => {
    console.log("in the row: row was selected " + id);
    onRowSelected(id);
  };
  console.log("image: " + image);
  return (
    <TouchableHighlight onPress={onClick} underlayColor={"gainsboro"}>
      <View style={styles.listRow}>
        {image == "" && (
          <Image
            style={styles.listRowImage}
            source={require("../assets/ava.png")}
          />
        )}
        {image != "" && (
          <Image
            style={styles.listRowImage}
            source={{ uri: image.toString() }}
          />
        )}

        <View style={styles.listRowTextContainer}>
          <Text style={styles.listRowName}>{title}</Text>
          <Text style={styles.listRowId}>{detail}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );
};

const MyPostList: FC<{ route: any; navigation: any }> = ({
  route,
  navigation,
}) => {
  const userEmail = JSON.stringify(route.params.userEmail);
  const onRowSelected = (id: String) => {
    console.log("in the list: row was selected " + id);
    navigation.navigate("PostEdit", {
      postId: id,
      userEmail: userEmail,
    });
  };

  const [posts, setPosts] = useState<Array<Post>>();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      console.log("focus");
      let posts: Post[] = [];
      try {
        posts = await PostModel.getAllPosts();
        console.log("fetching posts complete");
      } catch (err) {
        console.log("fail fetching posts " + err);
      }
      console.log("fetching finish");
      setPosts(posts);
    });
    return unsubscribe;
  });

  return (
    <FlatList
      style={styles.flatlist}
      data={posts}
      keyExtractor={(post) => post.id.toString()}
      renderItem={({ item }) => (
        <ListItem
          title={item.title}
          detail={item.detail}
          image={item.image}
          onRowSelected={onRowSelected}
          id={item.id}
        />
      )}
    ></FlatList>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: StatusBar.currentHeight,
    flex: 1,
    backgroundColor: "grey",
  },
  flatlist: {
    flex: 1,
  },
  listRow: {
    margin: 4,
    flexDirection: "row",
    height: 150,
    elevation: 1,
    borderRadius: 2,
  },
  listRowImage: {
    margin: 10,
    resizeMode: "contain",
    height: 130,
    width: 130,
  },
  listRowTextContainer: {
    flex: 1,
    margin: 10,
    justifyContent: "space-around",
  },
  listRowName: {
    fontSize: 30,
  },
  listRowId: {
    fontSize: 25,
  },
});

export default MyPostList;
