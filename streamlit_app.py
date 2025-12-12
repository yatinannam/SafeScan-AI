import streamlit as st
import google.generativeai as genai
import os
import json

# Load Gemini API key from Streamlit Secrets
API_KEY = st.secrets["GEMINI_API_KEY"]
genai.configure(api_key=API_KEY)

# Gemini Model
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    system_instruction="""
You are SafeScan AI — an expert scam and phishing detection assistant.
Return ONLY valid JSON with the following keys:
- risk_label
- risk_score
- summary
- red_flags
- evidence
- recommended_action
- confidence
"""
)

st.set_page_config(page_title="SafeScan AI", page_icon="🛡️")

st.title("🛡️ SafeScan AI")
st.write("Analyze messages, emails, or links for phishing and scam risks.")

text = st.text_area("Paste your message here:", height=200)

if st.button("Analyze"):
    if not text.strip():
        st.error("Please enter a message.")
    else:
        with st.spinner("Analyzing..."):
            response = model.generate_content(text)
            raw = response.text

            # Extract JSON from model output
            try:
                data = json.loads(raw)
            except:
                cleaned = raw[raw.find("{"): raw.rfind("}") + 1]
                data = json.loads(cleaned)

            st.subheader("Risk Level")
            st.metric(data["risk_label"], data["risk_score"])

            st.subheader("Summary")
            st.write(data["summary"])

            st.subheader("Red Flags")
            for flag in data["red_flags"]:
                st.write("•", flag)

            st.subheader("Evidence")
            for e in data["evidence"]:
                st.write("> ", e)

            st.subheader("Recommended Actions")
            for a in data["recommended_action"]:
                st.write("•", a)
