import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { OptionsWithUri } from 'request-promise-native';

export class IntegremeCnpj implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Integre.me - CNPJ',
		name: 'integremeCnpj',
		icon: 'file:integreme-logo.svg',
		group: ['transform'],
		version: 1,
		description: 'CNPJ - Unique Brazilian Company Reference.',
		defaults: {
			name: 'IntegremeCnpj',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			{
				displayName: 'CNPJ',
				name: 'cnpj',
				type: 'string',
				default: '',
				placeholder: 'Type CNPJ',
				description: 'Enter a valid CNPJ',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		let responseData;
		let returnData: INodeExecutionData[] = [];

		const items = this.getInputData();
		const length = items.length;

		for (let i = 0; i < length; i++) {
			try {
				const cnpj = this.getNodeParameter('cnpj', i) as string;

				const options: OptionsWithUri = {
					headers: {
						Accept: 'application/json',
					},
					method: 'GET',
					uri: `https://publica.cnpj.ws/cnpj/${cnpj}`,
					json: true,
				};

				responseData = await this.helpers.request(options);
				returnData.push({ json: responseData });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message } });
					continue;
				}
				throw error;
			}
		}
		return [this.helpers.returnJsonArray(returnData)];
	}
}
