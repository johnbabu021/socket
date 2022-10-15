
export default function Isonline(url: any): {
  sender: string;
  reciver: string;
} {
  let queryString: any = url!.query!.split("&");
  console.log(queryString);
  let sender = "";
  let reciver = "";
  queryString.map((item: any) => {
    if (item.startsWith("sender")) {
      sender = item.split("sender=")[1];
    } else {
      reciver = item.split("reciver=")[1];
    }
  });
  return {
    sender: sender,
    reciver: reciver,
  };
}
