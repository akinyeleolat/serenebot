const checkFeelingToday = {
  text: "How are you doing?",
  fallback: "Upgrade your Slack client to use messages like these.",
  color: "#3AA3E3",
  attachment_type: "default",
  callback_id: "feelings",
  actions: [
    {
      name: "Feeling_list",
      text: "Select one",
      type: "select",
      action_id: "open_modal_button",
      options: [
        {
          text: "Doing Well",
          value: "doing_well",
        },
        {
          text: "Neutral",
          value: "neutral",
        },
        {
          text: "Feeling Lucky",
          value: "feeling_lucky",
        },
      ],
    },
  ],
};
module.exports=checkFeelingToday;