const messageJsonBlock = {
    "blocks":[
	{
		"type": "section",
		"text": {
			"type": "mrkdwn",
			"text": "replace this"
		},
		"accessory": {
			"type": "static_select",
			"placeholder": {
				"type": "plain_text",
				"text": "How are you doing today",
				"emoji": true
			},
			"options": [
				{
					"text": {
						"type": "plain_text",
                        "text": "Doing Well",
						"emoji": true
					},
					"value": "doing_well"
				},
				{
					"text": {
						"type": "plain_text",
						"text":  "Neutral",
						"emoji": true
					},
					"value": "neutral"
				},
				{
					"text": {
						"type": "plain_text",
						"text": "Feeling Lucky",
						"emoji": true
					},
					"value": "feeling_lucky"
				}
			],
			"action_id": "open_modal_button"
		}
	}
]
}

module.exports=messageJsonBlock ;