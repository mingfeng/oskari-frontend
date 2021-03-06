Oskari.registerLocalization(
{
    "lang": "ru",
    "key": "MyPlacesImport",
    "value": {
        "title": "Собственные наборы данных",
        "desc": "",
        "tool": {
            "tooltip": "Импортировать свои собственные наборы данных."
        },
        "flyout": {
            "title": "Импортировать набор данных",
            "description": "Загрузите набор данных с вашего компьютера в форме ZIP файлов, которые содержат все необходимые файлы одного из следующих форматов: <ul><li>Shapefile (.shp, .shx и .dbf, опционально .prj и .cpg)</li><li>GPX-file (.gpx)</li><li>MapInfo (.mif и .mid)</li><li>Google Map (.kml и .kmz)</li></ul>ZIP файл может содержать лишь один набор данных и не может превышать <xx> Мб.",
            "help": "Загрузите набор данных с вашего компьютера в форме ZIP файлов. Проверьте, чтобы все файлы находились в нужном формате и согласованы с системой координат.",
            "actions": {
                "cancel": "Отменить",
                "next": "Далее",
                "close": "Закрыть"
            },
            "layer": {
                "title": "Информация о наборе данных",
                "name": "Название слоя карты",
                "desc": "Описание",
                "source": "Источник данных",
                "style": "Определение стилей"
            },
            "validations": {
                "error": {
                    "title": "Ошибка",
                    "message": "Набор данных не импортирован. Отсутствуют файл и название. Пожалуйста, исправьте их и попробуйте снова."
                }
            },
            "finish": {
                "success": {
                    "title": "Импортирование данных прошло успешно",
                    "message": "Набор данных импортирован с <xx> объектами. Теперь вы можете его найти в меню \"Мои данные\""
                },
                "failure": {
                    "title": "Не удалось импортировать набор данных."
                }
            },
            "error": {
                "title": "Не удалось импортировать набор данных.",
                "unknown_projection": "Неизвестные данные проекции в исходном файле импортирования. Убедитесь, что все файлы находятся в системе координат карты или что файлы содержат необходимую информацию о преобразовании.",
                "invalid_file": "Не улалось найти приемлемый импортируемый файл в ZIP файле. Проверьте, чтобы формат файла поддерживался и был ZIP файлом.",
                "unable_to_store_data": "Не удалось сохранить пользовательские данные в базе данных или нет объектов во входных данных.",
                "short_file_prefix": "Не удалось получить набор файлов импорта - строка префикса слишком короткая",
                "file_over_size": "Выбранный файл слишком велик. Самое большое допустимое значение - <xx> Mб.",
                "no_features": "Не удалось найти объекты во входных данных",
                "malformed": "Убедитесь, что имена файлов имеют правильный формат (не скандинавский алфавит).",
                "kml": "Не удалось создать набор данных из файла KML.",
                "shp": "Не удалось создать набор данных из файла Shapefile.",
                "mif": "Не удалось создать набор данных из файла MIF.",
                "gpx": "Не удалось создать набор данных из файла GPX.",
                "timeout": "Не удалось завершить импорт набора данных из-за ошибки времени ожидания.",
                "abort": "Импорт набора данных был прерван.",
                "parsererror": "Не удалось обработать набор данных.",
                "generic": "Ошибка импорта набора данных."
            },
            "warning": {
                "features_skipped": "Осторожно! Во время импортирования <xx> пространственных объектов были отклоненны из-за отсутствия или нарушения координат или геометрии"
            }
        },
        "tab": {
            "title": "Набор данных",
            "editLayer": "Редактировать слой карты",
            "deleteLayer": "Стереть слой карты",
            "grid": {
                "name": "Название",
                "description": "Описание",
                "source": "Источник данных",
                "edit": "Редактировать",
                "editButton": "Редактировать",
                "remove": "Удалить",
                "removeButton": "Удалить"
            },
            "confirmDeleteMsg": "Вы хотите удалить набор данных \"{name}\"?",
            "buttons": {
                "ok": "OK",
                "save": "Сохранить",
                "cancel": "Отменить",
                "delete": "Удалить",
                "close": "Закрыть"
            },
            "notification": {
                "deletedTitle": "Удаление набора данных",
                "deletedMsg": "Набор данных удален.",
                "editedMsg": "Набор данных обновлен."
            },
            "error": {
                "title": "Ошибка",
                "generic": "Произошла системная ошибка.",
                "deleteMsg": "Не удалось удалить набор данных из-за ошибки в системе. Повторите попытку позже.",
                "editMsg": "Не удалось обновить набор данных из-за ошибки в системе. Повторите попытку позже.",
                "getStyle": "Стиль, определенный для набора данных, не найден. В форме отображаются значения по умолчанию. Измените определения стилей перед сохранением изменений",
                "styleName": "Присвойте название слою карты и повторите попытку."
            }
        },
        "layer": {
            "organization": "Личный набор данных",
            "inspire": "Личный набор данных"
        }
    }
});
