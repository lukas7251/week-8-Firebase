import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { firestore, collection } from './firebase/Config.js';
import { query, onSnapshot, orderBy } from 'firebase/firestore';
import { convertFirebaseTimeStampToJS } from './helpers/Functions.js';

export default function App() {
	const [message, setMessage] = useState([])
	useEffect(() => {
		const q = query(collection(firestore, "messages"), orderBy('created', 'desc'))
		const unsubscribe = onSnapshot(q, (querySnapshot) => {
			const tempMessages = []
			querySnapshot.forEach((doc) => {
				const messageObject = {
					id: doc.id,
					text: doc.data().text,
					created: convertFirebaseTimeStampToJS(doc.data().created)
				}
				tempMessages.push(messageObject)
			})
			setMessage(tempMessages)
		})

		return () => {
			unsubscribe()
		}
	})

  return (
		<SafeAreaView style={styles.container}>
			<ScrollView>
				{
					message.map((message) => (
						<View style={styles.message} key={message.id}>
							<Text style={styles.messageInfo}>{message.created}</Text>
							<Text>{message.text}</Text>
						</View>
					))
				}
			</ScrollView>
		</SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
		paddingTop: 50,
    flex: 1,
    backgroundColor: '#fff',
  },
	message: {
		padding: 10,
		marginTop: 10,
		marginBottom: 10,
		backgroundColor: '#f5f5f5',
		borderColor: '#ccc',
		borderWidth: 1,
		borderRadius: 5,
		marginLeft: 5,
		marginRight: 10
	},
	messageInfo: {
		fontSize: 12,
	}
});
