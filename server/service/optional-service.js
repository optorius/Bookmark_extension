const optionalModel = require("../models/optional-model");

class OptionalService
{
    async saveResetCode( userId, resetCode )
    {
        const optionalData = await optionalModel.findOne( { user: userId } );
        if ( optionalData ) {
            optionalData.resetCode = resetCode;
            return optionalData.save();
        }
        const res = await optionalModel.create( { user: userId, resetCode } );
        return res;
    }

    async getOptional( userId )
    {
        const optional = await optionalModel.findOne( { user : userId } );
        return optional;
    }

    async deleteOptional ( userId )
    {
        await optionalModel.deleteMany( { user: userId } );
    }
}

module.exports = new OptionalService();