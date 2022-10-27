import axios from "axios"

const api_url = `http://ec2-18-176-178-106.ap-northeast-1.compute.amazonaws.com/toktokmall/`

export const AxiosUtil = async (endpoint, signature, body, callback) => {

  let formData = new FormData()
  formData.append("signature", signature)
  formData.append("data", JSON.stringify(body))

  console.log("url", `${api_url}${endpoint}`)

  await axios
    .post(`${api_url}${endpoint}`, formData)
    .then((response) => {
      
      if(response.data && response.data.success == 1){
        callback("success", response.data)
      }else{
        console.log("Response", response.data) 
				callback("error", response.data)
      }
    }).catch((error) => {
      console.log(error)
			callback("error", error)
  })

}