import streamlit as st
import requests
import os

st.set_page_config(page_title="SafeScan AI", page_icon="🛡️")

API_URL = st.secrets["API_URL"]  # You will add this later in Streamlit Secrets

st.title("🛡️ SafeScan AI")
st.write("Analyze any message, email, or link for phishing or scam risks.")

user_text = st.text_area("Paste your message here:", height=200)

if st.button("Analyze"):
    if not user_text.strip():
        st.error("Please enter a message.")
    else:
        with st.spinner("Analyzing..."):
            response = requests.post(API_URL, json={"text": user_text})
            result = response.json()

            st.subheader("Risk Level")
            st.metric(result["risk_label"], result["risk_score"])

            st.subheader("Summary")
            st.write(result["summary"])

            st.subheader("Red Flags")
            for flag in result["red_flags"]:
                st.write("•", flag)

            st.subheader("Evidence")
            for e in result["evidence"]:
                st.write("> ", e)

            st.subheader("Recommended Actions")
            for action in result["recommended_action"]:
                st.write("•", action)
