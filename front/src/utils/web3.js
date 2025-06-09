import Web3 from 'web3';
import AttendanceABI from './AttendanceABI.json';

const contractAddress = '0xABCDEF1234567890ABCDEFFEDCBA987654321000'; // 실제 배포 주소로 변경

let web3;
let contract;

export const getWeb3 = () => {
  if (!web3) {
    web3 = new Web3(window.ethereum);
  }
  return web3;
};

export const getContract = async () => {
  if (!contract) {
    const web3 = getWeb3();
    contract = new web3.eth.Contract(AttendanceABI, contractAddress);
  }
  return contract;
};

