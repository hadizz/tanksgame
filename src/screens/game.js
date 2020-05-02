import React, {
  useState,
  useEffect
} from 'react';
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  Text,
  Modal,
  Dimensions,
  StyleSheet,
  Image,
  StatusBar,
  Switch
} from 'react-native';

const Game = () => {

  let land = 5;
  let info = 1;

  const [bombAtDownX, setBombAtDownX] = useState(0);
  const [bombAtDownY, setBombAtDownY] = useState(0);
  const [bombAtUp, setBombAtUp] = useState([0, 0]);

  const [isAttack, setIsAttack] = useState(false);

  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height - StatusBar.currentHeight);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [landH, setLandH] = useState(windowHeight / 11 * land);
  const [infoH, setInfoH] = useState(windowHeight / 11 * info);

  const [turn, setTurn] = useState(1);
  const [bombs, setBombs] = useState(10);
  const [score, setScore] = useState(0);

  const [targets, setTargets] = useState(randomTargets());

  const [modalVisible, setModalVisible] = useState(false);
  const [endGameModalVisible, setEndGameModalVisible] = useState(false);

  const [isTwoPlayer, setIsTwoPlayer] = useState(false);
  const toggleSwitch = () => setIsTwoPlayer(!isTwoPlayer);
  const [playerOneBombs, setPlayerOneBombs] = useState(10);
  const [playerTwoBombs, setPlayerTwoBombs] = useState(10);

  const [playerOneScore, setplayerOneScore] = useState(0);
  const [playerTwoScore, setplayerTwoScore] = useState(0);

  const [winner, setWinner] = useState(0);

  function randomTargets() {
    let arr = [];
    for (let i = 1; i <= 6; i++) {
      arr.push([Math.floor(Math.random() * (windowWidth - 50)) + 20, Math.floor(Math.random() * (landH - 50)) + 20])
    }
    return arr;
  }

  useEffect(() => {
    setBombAtUp([bombAtDownX, landH - bombAtDownY]);
    setIsAttack(false);
  }, [bombAtDownX, bombAtDownY]);

  useEffect(() => {
    if (bombs === 0) {
      setEndGameModalVisible(true);
    }
    if (playerTwoBombs === 0) {
      handleWinner();
      setEndGameModalVisible(true);
    }
  }, [bombs, playerTwoBombs]);

  useEffect(() => {
    console.log("\t\ttargets changed");

    if (targets.length === 0) {
      console.log("\t\ttargets are zero");
      if (isTwoPlayer) {
        handleWinner();
      }
      setEndGameModalVisible(true);
    }
  }, [targets.length]);

  function handleWinner() {
    if (playerOneScore > playerTwoScore) {
      setWinner(1);
    }
    else if (playerOneScore < playerTwoScore) {
      setWinner(2);
    }
    else {
      setWinner(0);
    }
  };

  function winnerMessage() {
    switch (winner) {
      case 0: return "بازی مساوی شد :)";
      case 1: return "بازیکن شماره یک برنده شد";
      case 2: return "بازیکن شماره دو برنده شد";
    }
  }

  handlePressDown = (event) => {
    event.preventDefault();
    const event_x = event.nativeEvent.pageX;
    const event_y = event.nativeEvent.pageY - landH - infoH;
    setBombAtDownX(event_x);
    setBombAtDownY(event_y);
  };

  function findTheHittedTank() {
    for (let i = 0; i < targets.length; i++) {
      if (bombAtUp[0] > targets[i][0] - 15 && bombAtUp[0] < targets[i][0] + 15 && bombAtUp[1] > targets[i][1] - 15 && bombAtUp[1] < targets[i][1] + 15) {
        console.log("\t", "!!!!! hit !!!!!");
        return i;
      }
    }
    return -1;
  }

  const attack = () => {
    setIsAttack(true);
    var index = findTheHittedTank();
    if (!isTwoPlayer) {
      setBombs(bombs - 1);
      if (index !== -1) {
        console.log("before ", targets);
        setScore(score + 1);
        targets.splice(index, 1);
        console.log("after ", targets);
      }
    }
    else {
      if (turn == 1) {
        setTurn(2);
        setPlayerOneBombs(playerOneBombs - 1);
        if (index !== -1) {
          targets.splice(index, 1);
          setplayerOneScore(playerOneScore + 1);
        }
      } else {
        setTurn(1);
        setPlayerTwoBombs(playerTwoBombs - 1);
        if (index !== -1) {
          targets.splice(index, 1);
          setplayerTwoScore(playerTwoScore + 1);
        }
      }
    }
  }

  const refreshGame = () => {
    setBombAtUp([0, 0]);
    setBombAtDownX(0);
    setBombAtDownY(0);
    setTurn(1);
    setBombs(10);
    setPlayerOneBombs(10);
    setPlayerTwoBombs(10);
    setWinner(0);
    setplayerOneScore(0);
    setplayerTwoScore(0);
    setScore(0);
    setTargets(randomTargets());
  }

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        transparent={true}
      >
        <View style={styles.modalcontainer}>
          <View style={styles.modalinnercontainer}>
            <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", fontSize: 18, marginBottom: 20 }}>تنظیمات بازی</Text>
            <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", fontSize: 14, marginBottom: 10 }}>بازی {isTwoPlayer ? "دو" : "یک"} نفره</Text>
            <Switch style={{ marginBottom: 20 }} onValueChange={toggleSwitch} value={isTwoPlayer} />
            <TouchableOpacity style={styles.btn5} onPress={() => { setModalVisible(!modalVisible); refreshGame(); }}><Text style={styles.closemodalbtn}>بستن</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={endGameModalVisible}
        transparent={true}
      >
        <View style={styles.modalcontainer}>
          <View style={styles.modalinnercontainer}>
            <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", fontSize: 18, marginBottom: 20 }}>بازی تموم شد!</Text>

            {isTwoPlayer ?
              <>
                <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", fontSize: 14, marginBottom: 10 }}>{winnerMessage()}</Text>
                <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", fontSize: 14, marginBottom: 10 }}>امتیاز بازیکن یک : {playerOneScore}</Text>
                <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", fontSize: 14, marginBottom: 20 }}>امتیاز بازیکن دو : {playerTwoScore}</Text>
              </>
              :
              <Text style={{ fontFamily: "IRANSansWeb(FaNum)_Medium", fontSize: 14, marginBottom: 20, direction: "rtl" }}>امتیازت تو این راند : {score}</Text>
            }

            <TouchableOpacity style={[styles.btn5, { backgroundColor: "#058aff" }]} onPress={() => { setEndGameModalVisible(!endGameModalVisible); refreshGame(); }}><Text style={styles.closemodalbtn}>یه دور دیگه بازی کنیم</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TouchableWithoutFeedback>
        <View style={{ height: landH, backgroundColor: '#fff4cc', }}>
          {targets && targets.map((target, index) => (
            <Image key={index} style={{ position: "absolute", top: target[1] - 25 / 2, left: target[0] - 25 / 2, width: 25, height: 25 }}
              source={require('../assets/img/tank.png')} />
          ))}
          {isAttack &&
            <Image
              style={{ top: bombAtUp[1] - 25 / 2, left: bombAtUp[0] - 25 / 2, width: 25, height: 25 }}
              source={require('../assets/img/bomb.png')}
            />
          }

        </View>
      </TouchableWithoutFeedback>

      <View style={{ borderColor: "black", height: infoH, width: "95%", marginLeft: "auto", marginRight: "auto", marginTop: "auto", marginBottom: "auto" }} >
        <View style={{ marginBottom: 4, flexDirection: "row-reverse", justifyContent: "space-between" }}>
          {(isTwoPlayer ?
            <>
              <Text style={styles.f12}>نوبت {turn}</Text>
              <Text style={styles.f12}>💣 یک : {playerOneBombs}</Text>
              <Text style={styles.f12}>🚩 یک : {playerOneScore}</Text>
              <Text style={styles.f12}>💣 دو : {playerTwoBombs}</Text>
              <Text style={styles.f12}>🚩 دو : {playerTwoScore}</Text>
            </>
            :
            <>
              <Text style={styles.f12}>💣 بمب های باقیمانده : {bombs}</Text>
              <Text style={styles.f12}>🚩 امتیاز : {score}</Text>
            </>
          )}
        </View>
        <View style={{ flexDirection: "row-reverse", justifyContent: "space-between" }}>
          <TouchableOpacity style={styles.btn1} onPress={() => attack()}><Text style={styles.attackbtn}>آتش</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn2} onPress={() => refreshGame()}><Text style={styles.restartbtn}>شروع مجدد</Text></TouchableOpacity>
          <TouchableOpacity style={styles.btn3} onPress={() => setModalVisible(true)}><Text style={styles.settingsbtn}>تنظیمات</Text></TouchableOpacity>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={(event) => handlePressDown(event)}>
        <View style={{ height: landH, backgroundColor: '#fff4cc' }}>
          {(bombAtDownX !== 0) &&
            <Image style={{ top: bombAtDownY - 25 / 2, left: bombAtDownX - 25 / 2, width: 25, height: 25 }} source={require('../assets/img/bomb.png')} />
          }
        </View>
      </TouchableWithoutFeedback>

    </View >
  );
}


const styles = StyleSheet.create({
  iransans: {
    fontFamily: "IRANSansWeb(FaNum)_Medium",
  },
  modalcontainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalinnercontainer: {
    width: 200,
    backgroundColor: "white",
    padding: 20,
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10
  },
  f12: {
    fontFamily: "IRANSansWeb(FaNum)_Medium",
    fontSize: 12,
  },
  f14: {
    fontFamily: "IRANSansWeb(FaNum)_Medium",
    fontSize: 14,
  },
  btn1: {
    borderRadius: 20,
    borderColor: "orange",
    borderWidth: 1.5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 10,
    paddingLeft: 10,
  },
  btn2: {
    borderRadius: 20,
    borderColor: "#32a852",
    borderWidth: 1.5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 10,
    paddingLeft: 10,
  },
  btn3: {
    borderRadius: 20,
    borderColor: "blue",
    borderWidth: 1.5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 10,
    paddingLeft: 10,
  },
  btn4: {
    borderRadius: 20,
    borderColor: "red",
    borderWidth: 1.5,
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 10,
    paddingLeft: 10,
  },
  btn5: {
    borderRadius: 20,
    backgroundColor: "red",
    paddingTop: 7,
    paddingBottom: 7,
    paddingRight: 20,
    paddingLeft: 20,
  },
  attackbtn: {
    fontFamily: "IRANSansWeb(FaNum)_Bold",
    color: "orange",
    fontSize: 12,
  },
  restartbtn: {
    fontFamily: "IRANSansWeb(FaNum)_Bold",
    color: "#32a852",
    fontSize: 12,
  },
  backbtn: {
    fontFamily: "IRANSansWeb(FaNum)_Bold",
    color: "red",
    fontSize: 12,
  },
  settingsbtn: {
    fontFamily: "IRANSansWeb(FaNum)_Bold",
    color: "blue",
    fontSize: 12,
  },
  closemodalbtn: {
    fontFamily: "IRANSansWeb(FaNum)_Bold",
    color: "white",
    fontSize: 14,
  },
});

export default Game;
