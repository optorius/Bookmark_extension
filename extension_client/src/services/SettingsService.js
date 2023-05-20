import api_axios from "../http";

export default class SettingsService {
    static async editSettings( settings ) {
        return api_axios.put('/settings', settings );
    }

    static async getSettings() {
        return api_axios.get('/settings');
    }
}