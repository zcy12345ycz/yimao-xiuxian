/* ============ 存档管理 ============ */
function openSaveManage(){
  let html='<div class="modal-title">存 档 管 理</div><div class="modal-sub">分享 / 备份 / 恢复</div>';
  html+='<div class="gacha-box">';
  html+='<div class="gacha-slot" id="smExport"><div class="gs-icon">📤</div><div class="gs-info"><div class="gs-name">导出存档</div><div class="gs-desc">复制存档码，或下载文件</div></div></div>';
  html+='<div class="gacha-slot" id="smImport"><div class="gs-icon">📥</div><div class="gs-info"><div class="gs-name">导入存档</div><div class="gs-desc">从存档码或文件恢复</div></div></div>';
  html+='</div><div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('smExport').onclick=(e)=>{e.stopPropagation();AudioSys.click();openExport()};
  $('smImport').onclick=(e)=>{e.stopPropagation();AudioSys.click();openImport()};
}
function openExport(){
  const code=exportSaveCode();
  let html='<div class="modal-title">导 出 存 档</div><div class="modal-sub">换设备 / 备份</div>';
  html+='<textarea class="import-box" id="exportCode" readonly>'+code+'</textarea>';
  html+='<button class="btn gold" style="width:100%;margin-top:12px;padding:15px" id="copySave">复 制 存 档 码</button>';
  html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="downloadSave">下 载 存 档 文 件</button>';
  html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="backSaveE">返 回</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('copySave').onclick=async(e)=>{e.stopPropagation();AudioSys.click();const ok=await copyText(code);toast(ok?'已复制':'复制失败')};
  $('downloadSave').onclick=(e)=>{e.stopPropagation();AudioSys.click();downloadSaveFile();toast('已下载')};
  $('backSaveE').onclick=(e)=>{e.stopPropagation();AudioSys.click();openSaveManage()};
}
function openImport(){
  let html='<div class="modal-title">导 入 存 档</div><div class="modal-sub">从存档码或文件恢复</div>';
  html+='<div class="tip-box warn">导入会<span class="hl">覆盖当前进度</span></div>';
  html+='<textarea class="import-box" id="importCode" placeholder="粘贴存档码..."></textarea>';
  html+='<button class="btn gold" style="width:100%;margin-top:12px;padding:15px" id="doImportBtn">导 入 存 档 码</button>';
  html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="pickFile">选 择 存 档 文 件</button>';
  html+='<button class="btn" style="width:100%;margin-top:8px;padding:14px" id="backSaveI">返 回</button>';
  html+='<div class="watermark wm-modal">'+GAME_AUTHOR+'</div>';
  showModal(html);
  $('doImportBtn').onclick=(e)=>{e.stopPropagation();AudioSys.click();const c=$('importCode').value;if(!c.trim()){toast('请先粘贴');return}doImport(c)};
  $('pickFile').onclick=(e)=>{e.stopPropagation();AudioSys.click();el.importFileInput.value='';el.importFileInput.click()};
  $('backSaveI').onclick=(e)=>{e.stopPropagation();AudioSys.click();openSaveManage()};
}

