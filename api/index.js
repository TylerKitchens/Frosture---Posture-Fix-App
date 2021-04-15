import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'
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

    async getTodayTotalTime(){
        try {
            const jsonValue = await AsyncStorage.getItem('@sessions')
            if (jsonValue != null) {
                let arr = JSON.parse(jsonValue)
                let total = 0
                arr.forEach(sess => {
                    sess.date = new Date(sess.date)
                    if(moment(sess.date).isSame(new Date(), "day") && sess.isCompleted){
                        total += sess.duration / 60
                    }
                })
                return total
            }
            else {
                return -1
            }
        } catch (e) {
            console.log(e)
            return -2
        }
    },

    async setSensitivity(val) {
        try {
            await AsyncStorage.setItem('@sensitivity', val.toString())
        } catch (e) {
            // saving error
        }
    },

    async getSensitivity() {
        try {
            let sens =  await AsyncStorage.getItem('@sensitivity')
            if(sens == null){
                return 0
            }else{
                return parseFloat(sens)

            }
        } catch (e) {
            // saving error
        }
    },

    async saveTwoDayNotify(notify) {
        try {
            const jsonValue = JSON.stringify(notify)
            await AsyncStorage.setItem('@twoDay', jsonValue)
        } catch (e) {
            // saving error
        }
    },
     
    async getTwoDayNotify(){
        try {
            const jsonValue = await AsyncStorage.getItem('@twoDay')
            if (jsonValue != null) {
                let notification = JSON.parse(jsonValue)
                return notification
            }else { 
                return {}
            }
        } catch (e) {
            // saving error
        }
    },

    async setNotificationStatus(status) {
        try {
            await AsyncStorage.setItem('@notifyStatus', status)
        } catch (e) {
            // saving error
        }
    },

    async getNotificationStatus() {
        try {
            return await AsyncStorage.getItem('@notifyStatus')
        } catch (e) {
            // saving error
        }
    },

    async deleteData() {
        try {
            await AsyncStorage.removeItem('@sessions')
        } catch (e) {
            // saving error
        }
    },

    async setFirstTime() {
        try {
            await AsyncStorage.setItem('@firstTime', 'true')
        } catch (e) {
            // saving error
        }
    },

    async isFirstTime() {
        try {
            let first = await AsyncStorage.getItem('@firstTime')
            if(first){
                return false
            }else { 
                return true
            }
        } catch (e) {
            // saving error
        }
    },

    async resetTutorial() {
        try {
            await AsyncStorage.removeItem('@firstTime')
        } catch (e) {
            // saving error
        }
    },


}