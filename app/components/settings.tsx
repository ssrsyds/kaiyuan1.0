import { useState, useRef, useMemo } from "react";
import EmojiPicker, { Theme as EmojiTheme } from "emoji-picker-react";
import styles from "./settings.module.scss";
import ResetIcon from "../icons/reload.svg";
import CloseIcon from "../icons/close.svg";
import ClearIcon from "../icons/clear.svg";
import { List, ListItem, Popover } from "./ui-lib";
import { IconButton } from "./button";
import {
  SubmitKey,
  Theme,
  ALL_MODELS,
  useChatStore,
  useAccessStore,
} from "../store";
import { Avatar } from "./home";
import Locale, { changeLang, getLang } from "../locales";

function SettingItem(props: {
  title: string;
  subTitle?: string;
  children: JSX.Element;
}) {
  return (
    <ListItem>
      <div className={styles["settings-title"]}>
        <div>{props.title}</div>
        {props.subTitle && (
          <div className={styles["settings-sub-title"]}>{props.subTitle}</div>
        )}
      </div>
      <div>{props.children}</div>
    </ListItem>
  );
}

export function Settings(props: { closeSettings: () => void }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [config, updateConfig, resetConfig, clearAllData] = useChatStore(
    (state) => [
      state.config,
      state.updateConfig,
      state.resetConfig,
      state.clearAllData,
    ]
  );

  const accessStore = useAccessStore();
  const enabledAccessControl = useMemo(
    () => accessStore.enabledAccessControl(),
    []
  );

  return (
    <>
      <div className={styles["window-header"]}>
        <div className={styles["window-header-title"]}>
          <div className={styles["window-header-main-title"]}>
            {Locale.Settings.Title}
          </div>
          <div className={styles["window-header-sub-title"]}>
            {Locale.Settings.SubTitle}
          </div>
        </div>
        <div className={styles["window-actions"]}>
          <div className={styles["window-action-button"]}>
            <IconButton
              icon={<ClearIcon />}
              onClick={clearAllData}
              bordered
              title={Locale.Settings.Actions.ClearAll}
            />
          </div>
          <div className={styles["window-action-button"]}>
            <IconButton
              icon={<ResetIcon />}
              onClick={resetConfig}
              bordered
              title={Locale.Settings.Actions.ResetAll}
            />
          </div>
          <div className={styles["window-action-button"]}>
            <IconButton
              icon={<CloseIcon />}
              onClick={props.closeSettings}
              bordered
              title={Locale.Settings.Actions.Close}
            />
          </div>
        </div>
      </div>
      <div className={styles["settings"]}>
        <List>
          <SettingItem title={Locale.Settings.Avatar}>
            <Popover
              onClose={() => setShowEmojiPicker(false)}
              content={
                <EmojiPicker
                  lazyLoadEmojis
                  theme={EmojiTheme.AUTO}
                  onEmojiClick={(e) => {
                    updateConfig((config) => (config.avatar = e.unified));
                    setShowEmojiPicker(false);
                  }}
                />
              }
              open={showEmojiPicker}>
              <div
                className={styles.avatar}
                onClick={() => setShowEmojiPicker(true)}>
                <Avatar role="user" />
              </div>
            </Popover>
          </SettingItem>

          <SettingItem title={Locale.Settings.SendKey}>
            <select
              value={config.submitKey}
              onChange={(e) => {
                updateConfig(
                  (config) =>
                    (config.submitKey = e.target.value as any as SubmitKey)
                );
              }}>
              {Object.values(SubmitKey).map((v) => (
                <option value={v} key={v}>
                  {v}
                </option>
              ))}
            </select>
          </SettingItem>

          <SettingItem title={Locale.Settings.previewInput}>
            <input
              type="checkbox"
              checked={config.previewInput}
              onChange={(e) =>
                updateConfig(
                  (config) => (config.previewInput = e.currentTarget.checked)
                )
              }></input>
          </SettingItem>

          <ListItem>
            <div className={styles["settings-title"]}>
              {Locale.Settings.Theme}
            </div>
            <select
              value={config.theme}
              onChange={(e) => {
                updateConfig(
                  (config) => (config.theme = e.target.value as any as Theme)
                );
              }}>
              {Object.values(Theme).map((v) => (
                <option value={v} key={v}>
                  {v}
                </option>
              ))}
            </select>
          </ListItem>

          <SettingItem title={Locale.Settings.Lang.Name}>
            <div className="">
              <select
                value={getLang()}
                onChange={(e) => {
                  changeLang(e.target.value as any);
                }}>
                <option value="en" key="en">
                  {Locale.Settings.Lang.Options.en}
                </option>

                <option value="cn" key="cn">
                  {Locale.Settings.Lang.Options.cn}
                </option>
              </select>
            </div>
          </SettingItem>

          <div className="no-mobile">
            <SettingItem title={Locale.Settings.FullScreen}>
              <input
                type="checkbox"
                checked={config.fullScreen}
                onChange={(e) =>
                  updateConfig(
                    (config) => (config.fullScreen = e.currentTarget.checked)
                  )
                }></input>
            </SettingItem>
          </div>
        </List>
        <List>
          <SettingItem
            title={Locale.Settings.ApiKey.Title}
            subTitle={Locale.Settings.ApiKey.SubTitle}>
            <input
              type="password"
              placeholder="🗝"
              value={config.apiKey}
              onChange={(e) =>
                updateConfig(
                  (config) => (config.apiKey = e.currentTarget.value)
                )
              }></input>
          </SettingItem>
          {enabledAccessControl ? (
            <SettingItem
              title={Locale.Settings.AccessCode.Title}
              subTitle={Locale.Settings.AccessCode.SubTitle}>
              <input
                value={accessStore.accessCode}
                type="password"
                placeholder="🗝"
                onChange={(e) => {
                  accessStore.updateCode(e.currentTarget.value);
                }}></input>
            </SettingItem>
          ) : (
            <></>
          )}
          <SettingItem
            title={Locale.Settings.HistoryCount.Title}
            subTitle={Locale.Settings.HistoryCount.SubTitle}>
            <input
              type="range"
              title={config.historyMessageCount.toString()}
              value={config.historyMessageCount}
              min="2"
              max="25"
              step="2"
              onChange={(e) =>
                updateConfig(
                  (config) =>
                    (config.historyMessageCount = e.target.valueAsNumber)
                )
              }></input>
          </SettingItem>

          <SettingItem
            title={Locale.Settings.CompressThreshold.Title}
            subTitle={Locale.Settings.CompressThreshold.SubTitle}>
            <input
              type="number"
              min={500}
              max={3096}
              value={config.compressMessageLengthThreshold}
              onChange={(e) =>
                updateConfig(
                  (config) =>
                    (config.compressMessageLengthThreshold =
                      e.currentTarget.valueAsNumber)
                )
              }></input>
          </SettingItem>
        </List>

        <List>
          <SettingItem title={Locale.Settings.Model}>
            <select
              value={config.modelConfig.model}
              onChange={(e) => {
                updateConfig(
                  (config) => (config.modelConfig.model = e.currentTarget.value)
                );
              }}>
              {ALL_MODELS.map((v) => (
                <option value={v.name} key={v.name} disabled={!v.available}>
                  {v.name}
                </option>
              ))}
            </select>
          </SettingItem>
          <SettingItem
            title={Locale.Settings.Temperature.Title}
            subTitle={Locale.Settings.Temperature.SubTitle}>
            <input
              type="range"
              value={config.modelConfig.temperature.toFixed(1)}
              min="0"
              max="1"
              step="0.1"
              onChange={(e) => {
                updateConfig(
                  (config) =>
                    (config.modelConfig.temperature =
                      e.currentTarget.valueAsNumber)
                );
              }}></input>
          </SettingItem>
          <SettingItem
            title={Locale.Settings.MaxTokens.Title}
            subTitle={Locale.Settings.MaxTokens.SubTitle}>
            <input
              type="number"
              min={100}
              max={3096}
              value={config.modelConfig.max_tokens}
              onChange={(e) =>
                updateConfig(
                  (config) =>
                    (config.modelConfig.max_tokens =
                      e.currentTarget.valueAsNumber)
                )
              }></input>
          </SettingItem>
          <SettingItem
            title={Locale.Settings.PresencePenlty.Title}
            subTitle={Locale.Settings.PresencePenlty.SubTitle}>
            <input
              type="range"
              value={config.modelConfig.presence_penalty.toFixed(1)}
              min="-2"
              max="2"
              step="0.5"
              onChange={(e) => {
                updateConfig(
                  (config) =>
                    (config.modelConfig.presence_penalty =
                      e.currentTarget.valueAsNumber)
                );
              }}></input>
          </SettingItem>
        </List>

        <List>
          <div style={{ padding: "10px 20px" }}>
            <h4>免责声明</h4>
            <p style={{ fontSize: "14px" }}>
              1.本网站是使用 OpenAI API的 ChatGPT
              镜像网站，仅供娱乐和学习目的，不得用于任何商业用途。
              <br />
              2.本网站所提供的信息和内容仅代表用户个人观点，不代表OpenAI或任何其他组织的观点。
              <br />
              3.本网站所提供的信息和内容可能存在不准确、不完整、过时或错误的情况，用户在使用时需自行判断其可靠性并承担相应风险。
              <br />
              4.用户在使用本网站时，应遵守所有适用的法律法规和用户协议，不得利用本网站进行任何违法或有害行为。
              <br />
              5.本网站不对用户因使用本网站而产生的任何直接或间接损失负责，包括但不限于经济损失、数据丢失、计算机系统损坏等。
              <br />
              6.本免责声明适用于本网站的所有用户，使用本网站即视为用户已同意本免责声明的所有内容。本网站有权随时修改本免责声明的内容，修改后的免责声明将在本网站上公布并立即生效。
              <br />
            </p>
          </div>
          <div></div>
        </List>
      </div>
    </>
  );
}
