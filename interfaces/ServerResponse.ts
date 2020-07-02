export class ServerResponse {
	statusType: any;
	dataResponse:any;

	constructor(statustype:number, data:any){
		this.statusType = statustype;
		this.dataResponse = data;
	}

	public sendResponse(){
		let response = {
			statustype: this.statusType,
			data: this.dataResponse
		}

		return response;
	}
}