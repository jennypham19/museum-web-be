'use strict'
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class EventExhibition extends Model {
        static associate(models) {
            EventExhibition.belongsTo(models.Event, {
                foreignKey: 'event_id',
                as: 'events'
            }),
            EventExhibition.belongsTo(models.Exhibition, {
                foreignKey: 'exhibition_id',
                as: 'exhibition'
            })
        }
    };

    EventExhibition.init({
        // Cột event_id: khóa ngoại, liên kết đến Events, không null
        event_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        // Cột exhibition_id: khóa ngoại, liên kết đến Exhibitions, không null
        exhibition_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        sequelize,
        modelName: 'EventExhibition',
        tableName: 'EventsExhibition'
    });

    return EventExhibition;
}