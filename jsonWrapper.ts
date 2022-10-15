export default function JsonWrapper(data: any) {
  console.log(data, "asdfasfasf from serer");
  if (typeof data !== "undefined") return JSON.stringify(data);
}
