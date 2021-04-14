import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE = {

    async getAllSessions() {
        try {
            const jsonValue = await AsyncStorage.getItem('@sessions')
            if (jsonValue != null) {
                let arr = JSON.parse(jsonValue)
                arr.forEach(sess => {

                    sess.date = new Date(sess.date)
                })
                return arr
            }
            else {
                return []
            }
        } catch (e) {
            // error reading value
        }
    },

    async newSession(duration) {
        let frosty = {
            duration: duration,
            date: new Date(),
            isCompleted: false,
            dings: 0
        }
        try {
            let allSessions = await this.getAllSessions()
            allSessions.push(frosty)
            const jsonValue = JSON.stringify(allSessions)
            await AsyncStorage.setItem('@sessions', jsonValue)
            return frosty.date.toISOString()
        } catch (e) {
            // saving error
        }
    },

    async quit(id, lasted, dingCount) {
        try {
            let allSessions = await this.getAllSessions()
            allSessions.forEach(sess => {
                if(sess.date.toISOString() === id){
                    console.log('quit')

                    sess.lasted = sess.duration - lasted,
                    sess.dings = dingCount
                }
            })
            const jsonValue = JSON.stringify(allSessions)
            await AsyncStorage.setItem('@sessions', jsonValue)
           
        } catch (e) {
            // saving error
            console.log(e)
        }
    },

     
}